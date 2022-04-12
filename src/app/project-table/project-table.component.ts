import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectServiceService } from '../services/project-service.service';

export interface Project {
  id: number;
  projectname: string;
  deptcode : string;
  users: string[]; 
  product : string;
  status : boolean;
  cieareaid : number;
  financeproductid : number;
}

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent implements OnInit {

  constructor(
    private projectService: ProjectServiceService
  ) { }

  displayedColumns: string[] = ['id', 'projectname' , 'deptcode' ,
     'users', 'product','status' , 'cieareaid' , 'financeproductid' , 'actions'];
  dataSource !: MatTableDataSource<Project>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjects().subscribe({
      next:(res)=>{   
        this.dataSource = new MatTableDataSource(res.projects);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(res);
      },
      error:(err)=>{
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

  }

  removeProject(project: any) {
    this.projectService.removeProject(project).subscribe({
      next:(res)=>{
        console.log(res);
        this.getProjects();
      },
      error:(error) => {
        console.log(error.message);
        
      }
    })
  }

}
