import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // injection of the service into the component:
  constructor(
    private formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  public showPassword: boolean = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showProgressBar = false
  performLogin() {
    this.showProgressBar = true;
    // console.log(this.LoginForm.value);
  }
}
