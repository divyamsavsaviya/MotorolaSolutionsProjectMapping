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
    private router: Router,
  ) { }

  // loginData => {email , password}
  loginEmployee(loginData: any) {
    return this.http.post<any>(this.apiURL + '/auth/login', loginData);
  }

  loggedIn() {
    // token exists ? true : false
    return !!localStorage.getItem('access_token');
  }

  // remove token from localStorage
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  setTokens(tokens: any) {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
}
