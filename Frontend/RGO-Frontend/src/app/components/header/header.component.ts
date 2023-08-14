import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  currentTime = new Date();

  constructor(private auth: AuthService, 
    private cookieService: CookieService) {}

  ngOnDestroy() {
    this.cookieService.deleteAll();
  }

  Logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
}
