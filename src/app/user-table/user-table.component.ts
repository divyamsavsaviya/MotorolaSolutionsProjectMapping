import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeDataService } from '../services/employee-data.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

export interface Employee {
  id: number;
  email: string;
  team: string;
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

  editUser(row : any) {
    this.dialog.open(EditUserDialogComponent,{
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
        
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

  deleteUser(id : number){
    // this.employeeService.deleteUser(id)
    // .subscribe({
    //   next:(res)=>{
    //     alert("User deleted successfully");
    //     this.getUsers(); 
    //   },
    //   error:()=>{
    //     alert("error while deleting data"); 
    //   }
    // })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
