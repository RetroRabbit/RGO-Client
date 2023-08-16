import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Token } from 'src/app/models/token.interface';

import { CookieService } from 'ngx-cookie-service';
interface RouteInfo {
  title: string;
  icon: string;
}

export const ROUTES: RouteInfo[] = [
    { title: 'Dashboard',  icon: 'dashboard' },
    { title: 'Workshops', icon: 'home_repair_service'},
    { title: 'User Profile', icon: 'person'},
    { title: 'Personal Project', icon: 'assignment' },
    { title: 'Events', icon: 'calendar_view_week'},
    { title: 'Forms Builder', icon: 'assignment_add'},
    { title: 'Forms', icon: 'assignment'},
    { title: 'Settings', icon: 'settings'},
    { title: 'Add User', icon: 'person'},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] | undefined;
  type$: Observable<Token> = this.store.select('app');
  userType: number | undefined; 


  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  constructor(private auth: AuthService, private store: Store<{ app: Token }>,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.menuItems = ROUTES;
    this.type$.subscribe(data => {
      this.userType = +data.type;
    });
    
  }

  IsMenuItemVisible(menuItem: RouteInfo): boolean {
    const type  = +this.cookieService.get("userType")

    if (menuItem.title === 'Dashboard') {
      return true;
    } else if (menuItem.title === 'Workshops' && (type === 0 || type === 1)) {
      return true;
    } else if (menuItem.title === 'Personal Project' && (type === 2 || type === 0)) {
      return true;
    } else if (menuItem.title === 'Events' && (type === 0)) {
      return true;
    } else if (menuItem.title === 'Forms' && (type === 3 || type === 0)) {
      return true;
    } else if (menuItem.title === 'Forms Builder' && (type === 3)) {
      return true;
    } else if (menuItem.title === 'Settings' && (type === 3)) {
      return true;
    } else if (menuItem.title === 'User Profile' && (type === 0 || type === 1)) {
      return true;
    }
    else if (menuItem.title === 'Add User') {
      return true;
    }
    return false;
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
    this.selectedItem.emit({
      selectedPage: target.innerText
    });
  }
}
