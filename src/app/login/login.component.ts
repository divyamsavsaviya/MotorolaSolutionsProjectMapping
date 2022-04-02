import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatIconRegistry } from "@angular/material/icon";
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', Validators.required);

  // injection of the service into the component:
  constructor(
    private matIconRegistry: MatIconRegistry,
    private formBuilder : FormBuilder,
    private _snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router,
  ) {
    // register our custom "motorola_solutions_logo" icon
    this.matIconRegistry.addSvgIcon(
      "motorola_solutions_logo",
      // To parse the URL path string into SafeResourceUrl
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/Motorola_Solutions_Logo.svg")
    );
  }

  LoginForm !: FormGroup;

  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  public showPassword: boolean = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  showProgressBar = false
  performLogin() {
    this.showProgressBar = true;
    const {email, password} = this.LoginForm.value;
    this.authService.loginEmployee({email, password}).subscribe( 
      res => {
        this.LoginForm.disable();
        this.authService.setToken(res.accessToken);
        this.router.navigate(['/dashBoard']);
      },
      err => {
        this.openSnackBar(err.error.error , "try again");
        this.LoginForm.reset();
        this.showProgressBar = false;
      }
    );
  }
}
