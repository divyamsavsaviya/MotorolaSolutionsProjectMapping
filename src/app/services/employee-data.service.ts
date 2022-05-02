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

  getEmployeeData(email: any) {
    return this.http.post<any>(this.apiURL + '/getEmployeeInformation', email);
  }

  getEmployee() {
    return this.http.get<any>(this.apiURL);
  }

  addEmployee({name ,email ,role , password }: any) {
    return this.http.post<any>(this.apiURL + '/', {name ,email ,role , password });
  }

  updateEmployeeRole({ id, role }: any) {
    return this.http.put<any>(this.apiURL + '/updateRole', { id, role });
  }

  deleteUser(id: any) {
    console.log('service.delete => ', id);
    return this.http.post<any>(this.apiURL + '/removeEmployee', id);
  }

  getExportedUsers() {
    return this.http.get<any>(this.apiURL + '/exportUsers',);
  }

  removeEmployees(userIds: any) {
    console.log(userIds);
    return this.http.post<any>(this.apiURL + '/removeEmployees', {userIds : userIds});
  }

  bulkInsert(users : any) {
    return this.http.post<any>(this.apiURL + '/importUsers' , {users : users});
  }
}
