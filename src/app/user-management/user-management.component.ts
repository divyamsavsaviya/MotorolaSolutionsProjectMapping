import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UserTableComponent } from '../user-table/user-table.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  @ViewChild(UserTableComponent) userTableComponent !:UserTableComponent;
  constructor(
    private dialog : MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openAddUserDialog() {
    this.dialog.open(AddUserDialogComponent,{
      width:'30%'
    }).afterClosed().subscribe(val => {
      if(val === 'add') {
        this.userTableComponent.getUsers();
      } 
    })
  }
}
