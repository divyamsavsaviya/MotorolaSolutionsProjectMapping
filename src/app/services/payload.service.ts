import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PayloadService {

  constructor(private router : Router) { }

  getEmployeeName() {
    const accessToken = localStorage.getItem('access_token');
    if(accessToken !== null) {
      const decoded : any = jwt_decode(accessToken);
      return decoded.name;
    }
  }

  getEmployeeEmail() {
    const accessToken = localStorage.getItem('access_token');
    if(accessToken !== null) {
      const decoded : any = jwt_decode(accessToken);
      return decoded.email;
    }
  }

  getEmployeeRole() {
    const accessToken = localStorage.getItem('access_token');
    if(accessToken !== null) {
      const decoded : any = jwt_decode(accessToken);
      return decoded.role;
    }
  }
}
