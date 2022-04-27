import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { FileService } from '../services/file.service';
import { PayloadService } from '../services/payload.service';
import { ProjectServiceService } from '../services/project-service.service';

export interface Project {
  id: number;
  projectname: string;
  deptcode: string;
  users: string[];
  product: string;
  status: boolean;
  cieareaid: number;
  financeproductid: number;
}

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent implements OnInit {

  constructor(
    private projectService: ProjectServiceService,
    private dialog: MatDialog,
    private payloadService: PayloadService,
    private fileService: FileService,
  ) { }

  displayedColumns: string[] = ['id', 'projectname', 'deptcode', 'users', 'product', 'status', 'cieareaid', 'financeproductid', 'actions'];
  dataSource !: MatTableDataSource<Project>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  role !: string;
  ngOnInit(): void {
    this.role = this.payloadService.getEmployeeRole();
    if (this.role === 'Viewer') {
      this.displayedColumns = ['id', 'projectname', 'deptcode', 'users', 'product', 'status', 'cieareaid', 'financeproductid'];
    }
    this.getProjects();
  }

  projects : any;
  getProjects() {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects = res.projects;
        this.dataSource = new MatTableDataSource(this.projects);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err.message);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProject(project: any) {
    this.dialog.open(AddProjectDialogComponent, {
      width: '30%',
      data: project
    }).afterClosed().subscribe(val => {
      if (val == 'update') {
        this.getProjects();
      }
    })
  }

  removeProject(project: any) {
    this.projectService.removeProject(project).subscribe({
      next: (res) => {
        console.log(res);
        this.getProjects();
      },
      error: (error) => {
        console.log(error.message);

      }
    })
  }

  exportProjects() {
    const headerList = ['id', 'projectname', 'deptcode', 'users', 'product', 'status', 'cieareaid', 'financeproductid'];
    this.fileService.downloadFile(this.projects,'projects',headerList);
  }

}
