import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private auth: AuthService) {}

  ngOnDestroy() {
    // clearInterval(this.intervalId);
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
  }

  Logout() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin

    } });
  }

}
