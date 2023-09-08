import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Token } from 'src/app/models/token.interface';
import { CookieService } from 'ngx-cookie-service';

interface RouteInfo {
  title: string;
  icon: string;
  requiredRole: string[];
}

export const ROUTES: RouteInfo[] = [
   
    { title: 'Charts', icon: 'analytics', requiredRole: [ ] },
    { title: 'Dashboard',  icon: 'dashboard', requiredRole: [ ] },
    { title: 'Add User', icon: 'person', requiredRole: [ 'Admin', 'SuperAdmin' ] },
    { title: 'Role Manager', icon: 'event_seat', requiredRole: [ 'Admin', 'SuperAdmin' ] },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  menuItems: RouteInfo[] = [];
  type$: Observable<Token> = this.store.select('app');

  constructor(private store: Store<{ app: Token }>,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.menuItems = ROUTES;
  }

  IsMenuItemVisible(menuItem: RouteInfo): boolean {
    const types: string = this.cookieService.get('userType');
    const roles: string[] = Object.keys(JSON.parse(types));

   const hasRequiredRoles : boolean = menuItem.requiredRole
   .filter((role: string) => roles.includes(role))
   .length > 0;
   
   if (hasRequiredRoles || menuItem.requiredRole.length === 0) return true;

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
