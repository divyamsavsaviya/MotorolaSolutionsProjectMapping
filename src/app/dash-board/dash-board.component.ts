import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmployeeDataService } from '../services/employee-data.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  showFiller = false;
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeDataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  logEmployees() {
    let employees: any;
    this.employeeService.getEmployees().subscribe(
      res => {
        employees = res
      },
      err => { 
        if(err instanceof HttpErrorResponse) {
          if(err.status === 401) {
            this.authService.logout();
          }
        }
      },
    )
  }

  logout() {
    this.authService.logout();
  }
  
  sideBarOpen = true;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
