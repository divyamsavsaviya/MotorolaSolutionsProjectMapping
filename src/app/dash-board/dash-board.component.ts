import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmployeeDataService } from '../services/employee-data.service';
import { PayloadService } from '../services/payload.service';
import {MatDialog} from '@angular/material/dialog';

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
    private payloadService: PayloadService,
    private router: Router,
    private dialog : MatDialog,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }
  
  sideBarOpen = false;
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  getEmployeeInformation() {
    const email = this.payloadService.getEmployeeEmail();
    this.employeeService.getEmployeeData(email).subscribe({
      next:(res) => {
        console.log(res);
      },
      error:(err) => {
        if(err.status === 401) {
          this.router.navigate(['/login'])
        }
      }
    }
    )
  }
}
