import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: any, next: any) {
    let accessToken = this.authService.getAccessToken();
    let tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    return next.handle(tokenizedRequest)
  }
}
