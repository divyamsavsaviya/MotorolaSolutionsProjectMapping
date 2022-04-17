import { Component, OnInit } from '@angular/core';
import { PayloadService } from '../services/payload.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  role !: string;
  constructor(
    private payloadService: PayloadService,
  ) { }

  name = this.payloadService.getEmployeeName();
  ngOnInit(): void {
    this.role = this.payloadService.getEmployeeRole();
  }

}
