import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.navService.showNavbar = window.innerWidth > 610;
    this.navService.showSideBar = window.innerWidth <= 610;
  }

  title = 'HRIS';
  screenWidth!: number;
  selectedItem: string = 'Dashboard';
  searchQuery: string = '';
  charts: Chart[] = [];

  employeeType: { id?: number, name?: string } = {
    id: 0,
    name: ''
  };

  constructor(
    public authAccessService: AuthAccessService,
    private router: Router,
    public navService: NavService
  ) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
  }

  handleSearchQuery(query: string) {
    this.searchQuery = query;
  }

  logout() {
    this.authAccessService.logout();
  }

  hasSignedIn(): boolean {
    return this.authAccessService.hasSignedIn();
  }
}
