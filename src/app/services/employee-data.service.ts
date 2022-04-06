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

  getEmployeData(email : any) {
    return this.http.post<any>(this.apiURL + '/getEmployeeInformation',email);
  }
}
