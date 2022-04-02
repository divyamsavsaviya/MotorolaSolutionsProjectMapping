import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EmployeeDataService } from '../services/employee-data.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeDataService,
  ) { }

  ngOnInit(): void {
  }
  
  logEmployees() {
    console.log(this.employeeService.getEmployees());
  }

  logout() {
    this.authService.logout();
  }
}
