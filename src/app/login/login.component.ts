import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatIconRegistry } from "@angular/material/icon";
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// import * as CryptoJs from 'crypto-js';

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
    private formBuilder: FormBuilder,
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
    this.authService.logout();
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
    this.LoginForm.controls['password'].disable();
    this.LoginForm.controls['email'].disable();
    this.showProgressBar = true;
    const { email, password } = this.LoginForm.value;

    // TODO - encrypt data
    // const emailCipher = CryptoJs.AES.encrypt(JSON.stringify(email),'123').toString();
    // const passwordCipher = CryptoJs.AES.encrypt(JSON.stringify(password),'123').toString();
    // this.authService.loginEmployee({emailCipher, passwordCipher}).subscribe( 

    this.authService.loginEmployee({ email, password }).subscribe(
      // here response contains tokens => accessToken & refreshToken
      res => {
        this.authService.setTokens(res);
        this.router.navigate(['/dashBoard']);
      },
      err => {
        this.LoginForm.controls['password'].enable();
        this.LoginForm.controls['email'].enable();
        if (err.error.errorType === 'invalid_email') {
          this.LoginForm.controls['password'].setValue("");
        }
        this.openSnackBar(err.error.error, "try again");
        this.showProgressBar = false;
      }
    );
  }
}
