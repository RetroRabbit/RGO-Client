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
  { title: 'Dashboard', icon: 'dashboard' },
  { title: 'Workshops', icon: 'home_repair_service' },
  { title: 'Personal Project', icon: 'assignment' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] | undefined;
  type$: Observable<Token> = this.store.select('app');
  userType: number | undefined ; // Default user type, you can change this based on your application's logic

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
    } else if (menuItem.title === 'Workshops' && this.userType === 0) {
      return true;
    } else if (menuItem.title === 'Personal Project' && this.userType === 2) {
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
