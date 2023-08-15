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

  IsMenuItemVisible(menuItem: RouteInfo, type : Token): boolean {
    console.log(`UserRoles: ${JSON.stringify(type)}`);
    let isGrad: boolean = false;
    let isPresenter: boolean = false;
    let isMentor: boolean = false;
    let isAdmin: boolean = false;
    
    let strRoles = type.roles.replace('[', '').replace(']', '').split(',');
    if (strRoles.length == 0) return false;

    let roles = type.roles.replace('[', '').replace(']', '').split(',');
    console.info('UserRole', roles);
    if (roles.includes('0')) isGrad = true;
    if (roles.includes('1')) isPresenter = true;
    if (roles.includes('2')) isMentor = true;
    if (roles.includes('3')) isAdmin = true;

    if (menuItem.title === 'Dashboard') return true;
    else if (menuItem.title === 'Workshops' && (isGrad || isPresenter)) return true;
    else if (menuItem.title === 'Personal Project' && (isMentor || isGrad)) return true;
    else if (menuItem.title === 'Events' && (isGrad)) return true;
    else if (menuItem.title === 'Forms' && (isAdmin || isGrad)) return true;
    else if (menuItem.title === 'Forms Builder' && (isAdmin)) return true;
    else if (menuItem.title === 'Settings' && (isAdmin)) return true;
  
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
