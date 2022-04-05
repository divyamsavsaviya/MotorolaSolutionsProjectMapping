import { Component, OnInit, Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() logoutForMe : EventEmitter<any> = new EventEmitter();
  @Output() toogleSidebarForMe : EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  logout() {
    this.logoutForMe.emit();
  }

  toggleSidebar() {
    this.toogleSidebarForMe.emit();
  }
}
