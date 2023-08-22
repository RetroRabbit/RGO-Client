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


  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  constructor(private auth: AuthService, private store: Store<{ app: Token }>,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.menuItems = ROUTES;
  }

  IsMenuItemVisible(menuItem: RouteInfo): boolean {
    const types = this.cookieService.get('userType');

    let isGrad: boolean = false;
    let isEmployee: boolean = false;
    let isPresenter: boolean = false;
    let isMentor: boolean = false;
    let isAdmin: boolean = false;
    
    const roles: string[] = types.replace('[', '').replace(']', '').split(',');

    if (roles.length == 0) return false;
    if (roles.includes('0')) isGrad = true;
    if (roles.includes('1')) isEmployee = true;
    if (roles.includes('2')) isPresenter = true;
    if (roles.includes('3')) isMentor = true;
    if (roles.includes('4')) isAdmin = true;

    if (menuItem.title === 'Dashboard') return true;
    else if (menuItem.title === 'Employee Profile' && (isGrad)) return true;
    else if (menuItem.title === 'Settings' && (isAdmin)) return true;
  
    return true;
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
    this.selectedItem.emit({
      selectedPage: target.innerText
    });
  }
}
