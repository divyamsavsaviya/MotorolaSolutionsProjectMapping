import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

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
    private domSanitizer: DomSanitizer
  ) {
    // register our custom "motorola_solutions_logo" icon
    this.matIconRegistry.addSvgIcon(
      "motorola_solutions_logo",
      // To parse the URL path string into SafeResourceUrl
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/Motorola_Solutions_Logo.svg")
    );
  }

  ngOnInit(): void {

  }

  public showPassword: boolean = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  performLogin() {
    console.log();
    console.log(this.passwordFormControl);
  }
}
