import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

interface RouteInfo {
    path: string;
    title: string;
    icon: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] | undefined;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES;
  }
}

