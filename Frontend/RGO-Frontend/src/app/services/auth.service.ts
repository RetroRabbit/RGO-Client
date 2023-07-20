import { Injectable } from '@angular/core';

import * as Auth0 from '@auth0/auth0-angular';
import { Observable, firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth0.AuthService) { }

  authenticateUser(): Observable<any>{

    this.generatePopUp();

    return this.auth.user$.pipe(take(1));
    
  }

  isAuthenticated(): Observable<boolean>{
    return this.auth.isAuthenticated$.pipe(take(1))
  }

  async generatePopUp(){
    await firstValueFrom(this.auth.loginWithPopup().pipe(take(1)));
      
  }

}
