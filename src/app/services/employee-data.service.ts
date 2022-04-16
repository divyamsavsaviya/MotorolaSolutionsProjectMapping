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

  getEmployee() {
    return this.http.get<any>(this.apiURL);
  }

  addEmployee(employee : any) {
    return this.http.post<any>(this.apiURL + '/',employee);
  }

  updateEmployeeRole({id , role} : any) {
    return this.http.put<any>(this.apiURL + '/updateRole',{id , role});
  }

  deleteUser(id : any) {
    console.log('service.delete => ',id);
    return this.http.post<any>(this.apiURL + '/removeEmployee',id);
  }

  getExportedUsers() {
    return this.http.get<any>(this.apiURL + '/exportUsers',);
  }
}
