import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Token } from 'src/app/models/token.interface';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Eval } from '../employee-evaluations/employee-evaluations.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  type$: Observable<Token> = this.store.select('app')
  selectedPage : string = this.cookieService.get("currentlPage") != "Dashboard" ?this.cookieService.get("currentlPage") :"Dashboard";
  selectedEvaluation!: any 

  constructor(
    private store: Store<{app: Token}>,
    private auth: AuthService,
    public cookieService: CookieService
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
    this.selectedPage = this.cookieService.get('currentPage');
  }  

  handleSelectedItem() {
    this.selectedPage = this.cookieService.get('currentPage');
  }

  handleSelectedEval(item: any){
    this.selectedEvaluation = item
  }
}
