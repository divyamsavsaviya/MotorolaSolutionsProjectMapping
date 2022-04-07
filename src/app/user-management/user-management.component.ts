import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  
  constructor(
    private dialog : MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openAddUserDialog() {
    this.dialog.open(AddUserDialogComponent,{
      width:'30%'
    })
  }
}
