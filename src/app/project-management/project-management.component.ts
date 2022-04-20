import { Component, OnInit, ViewChild } from '@angular/core';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectTableComponent } from '../project-table/project-table.component';
import { DialogFileUploadComponent } from '../dialog-file-upload/dialog-file-upload.component';
import { ProjectServiceService } from '../services/project-service.service';
import { PayloadService } from '../services/payload.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {

  @ViewChild(ProjectTableComponent) projectTableComponent !: ProjectTableComponent;
  constructor(
    private dialog: MatDialog,
    private projectService: ProjectServiceService,
    private payloadService: PayloadService,
  ) { }

  role !: string;
  ngOnInit(): void {
    this.role = this.payloadService.getEmployeeRole();
  }

  openAddProjectDialog() {
    this.dialog.open(AddProjectDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'add') {
        this.projectTableComponent.getProjects();
      }
    })
  }

  openFileUploadDialog() {
    this.dialog.open(DialogFileUploadComponent, {
      width: '30%'
    })
  }

  exportProject() {
    this.projectTableComponent.exportProjects();
  }
}
