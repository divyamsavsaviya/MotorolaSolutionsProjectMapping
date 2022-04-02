import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://localhost:3000/api'
  constructor(
    private http: HttpClient,
    private router: Router,) { }

  // loginData => {email , password}
  loginEmployee(loginData: any) {
    return this.http.post<any>(this.apiURL + '/auth/login', loginData);
  }

  loggedIn() {
    // token exists ? true : false
    return !!localStorage.getItem('token');
  }

  // remove token from localStorage
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: any) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
