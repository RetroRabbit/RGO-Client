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
    { title: 'Personal Project', icon: 'assignment'}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] | undefined;
  type$: Observable<Token> = this.store.select('app');

 @Output() selectedItem = new EventEmitter<{selectedPage : string}>();

  constructor(private auth: AuthService, private store: Store<{app: Token}>,) { }

  ngOnInit() {
    this.menuItems = ROUTES;
  }

  GetUserType() {
    let type = 0
    this.type$.subscribe(data => {
      type = +data.type;
    });
    return type
  }

  CaptureEvent(event : any){
    const target = event.target as HTMLAnchorElement;
    this.selectedItem.emit({
      selectedPage : target.innerText
    });
  }
}



