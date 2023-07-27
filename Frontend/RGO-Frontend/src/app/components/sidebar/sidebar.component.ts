import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

interface RouteInfo {
    title: string;
    icon: string;
}

export const ROUTES: RouteInfo[] = [
    { title: 'Dashboard',  icon: 'dashboard' },
    { title: 'Workshops', icon: 'home_repair_service'},
    { title: 'Events', icon: 'calendar_view_week'}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] | undefined;

 @Output() selectedItem = new EventEmitter<{selectedPage : string}>();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES;
  }

  CaptureEvent(event : any){
    const target = event.target as HTMLAnchorElement;
    this.selectedItem.emit({
      selectedPage : target.innerText
    });
  }
}



