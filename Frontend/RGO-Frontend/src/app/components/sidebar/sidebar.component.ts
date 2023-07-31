import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Token } from 'src/app/models/token.interface';

interface RouteInfo {
  title: string;
  icon: string;
}

export const ROUTES: RouteInfo[] = [
    { title: 'Dashboard',  icon: 'dashboard' },
    { title: 'Workshops', icon: 'home_repair_service'},
    { title: 'Personal Project', icon: 'assignment' },
    { title: 'Events', icon: 'calendar_view_week'},
    { title: 'Forms Builder', icon: 'assignment_add'},
    { title: 'Forms', icon: 'assignment'},
    { title: 'Settings', icon: 'settings'},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] | undefined;
  type$: Observable<Token> = this.store.select('app');
  userType: number | undefined ; 

  @Output() selectedItem = new EventEmitter<{ selectedPage: string }>();

  constructor(private auth: AuthService, private store: Store<{ app: Token }>) { }

  ngOnInit() {
    this.menuItems = ROUTES;

    this.type$.subscribe(data => {
      this.userType = +data.type;
    });
  }

  IsMenuItemVisible(menuItem: RouteInfo): boolean {

    if (menuItem.title === 'Dashboard') {
      return true;
    } else if (menuItem.title === 'Workshops' && (this.userType === 0 || this.userType === 1)) {
      return true;
    } else if (menuItem.title === 'Personal Project' && (this.userType === 2 || this.userType === 0)) {
      return true;
    } else if (menuItem.title === 'Events' && (this.userType === 0)) {
      return true;
    } else if (menuItem.title === 'Forms' && (this.userType === 3 || this.userType === 0)) {
      return true;
    } else if (menuItem.title === 'Forms Builder' && (this.userType === 3)) {
      return true;
    } else if (menuItem.title === 'Settings' && (this.userType === 3)) {
      return true;
    }

  
    return false;
  }
  
  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.selectedItem.emit({
      selectedPage: target.innerText
    });
  }
}
