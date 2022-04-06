import { Component, OnInit, Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() logoutForMe : EventEmitter<any> = new EventEmitter();
  @Output() toggleSidebarForMe : EventEmitter<any> = new EventEmitter();
  @Output() openProfileForMe : EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  logout() {
    this.logoutForMe.emit();
  }

  openProfile() {
    this.openProfileForMe.emit();
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
}
