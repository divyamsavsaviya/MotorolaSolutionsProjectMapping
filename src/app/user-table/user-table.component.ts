import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDataService } from '../services/employee-data.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

export interface Employee {
  id: number;
  email: string;
  name : string;
  role: string;
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  constructor(
    private employeeService : EmployeeDataService,
    private dialog : MatDialog,
  ) { }

  displayedColumns: string[] = ['id', 'email' , 'name' , 'role', 'actions'];
  dataSource !: MatTableDataSource<Employee>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getUsers();
  }

  editRole(row : any) {
    this.dialog.open(AddUserDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val == 'update') {
        this.getUsers();
      }
    })
  }

  getUsers() {
    this.employeeService.getEmployee().subscribe({
      next:(res)=>{   
        this.dataSource = new MatTableDataSource(res.employees);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

  deleteUser(row : any){
    console.log(row);
    this.employeeService.deleteUser(row).subscribe({
      next:(res)=>{
        this.getUsers();
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
}
