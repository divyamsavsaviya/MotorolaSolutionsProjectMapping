import { Component, OnInit } from '@angular/core';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {

  constructor(
    private dialog : MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openAddProjectDialog() {
    this.dialog.open(AddProjectDialogComponent,{
      width:'30%'
    })
  }
}
