import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    { title: 'Add User', icon: 'person'},
    { title: 'Charts', icon: 'analytics'}
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

  constructor(private store: Store<{ app: Token }>,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.menuItems = ROUTES;
  }

  IsMenuItemVisible(menuItem: RouteInfo): boolean {
    const types = this.cookieService.get('userType');

   // Todo when we have roles
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
