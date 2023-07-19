import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  constructor(private auth: AuthService,private store: Store<{ GoogleID: AppState}>) {}
  // onstructor(private store: Store<{ book: Book }>

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

  ngOnInit() {
    this.store.select('GoogleID').subscribe(state => {
      console.log(state);
    });
  }

}
