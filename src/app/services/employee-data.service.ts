import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {

  private apiURL = 'http://localhost:3000/api/employees'
  constructor(
    private http: HttpClient,
  ) { }

  getEmployees() {
    return this.http.get<any>(this.apiURL);
  }
}
