import { Component, OnInit } from '@angular/core';
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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) {
      // register our custom "motorola_solutions_logo" icon
    this.matIconRegistry.addSvgIcon(
      "motorola_solutions_logo",
      // To parse the URL path string into SafeResourceUrl
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/Motorola_solutions_Logo.svg")
    );
   }

  ngOnInit(): void {
    
  }

  public showPassword: boolean = false;

  log(username: any  , password: any ) {
    console.log(username + " " + password);
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
