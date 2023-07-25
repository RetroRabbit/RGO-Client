import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Token } from 'src/app/models/token.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  type$: Observable<Token> = this.store.select('app')

  constructor(
    private store: Store<{app: Token}>,
    private auth: AuthService
    ) {}

  ngOnDestroy() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
  }

  Logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }

  ngOnInit() {
  }

  GetUserType(user: any) {
    return +user.type
  }
}
