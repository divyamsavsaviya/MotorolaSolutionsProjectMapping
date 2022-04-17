import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PayloadService } from '../services/payload.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private payloadService: PayloadService, 
    private router: Router) { }

  canActivate(): boolean {
    if(this.payloadService.getEmployeeRole() == 'Admin'){
      return true;
    } else {
      this.router.navigate(['/login'])
      return false;
    }
  }
}
