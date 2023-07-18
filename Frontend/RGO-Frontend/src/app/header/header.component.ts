import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  currentTime = new Date();
  // ngOnInit() {}
  // private intervalId!: NodeJS.Timeout;

  constructor(private auth: AuthService) {}
  //   this.intervalId = setInterval(() => {
  //     this.currentTime = new Date();
  //   }, 1000);
  // }
  ngOnDestroy() {
    // clearInterval(this.intervalId);
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
  }

  logOut() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } });
  }
}
