import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Userstacks } from '../models/userstacks.interface';
import { API } from '../models/constants/urls.constants';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserstacksService {
  token: string = '';
  email: string = '';

  constructor(private client: HttpClient, private store: Store<{app: Token}>, private cookieService: CookieService) { }

  getUserstacks(): Observable<Userstacks>{
    return this.client.get<Userstacks>(`${API.HttpsBaseURL}/gradstacks/get?email=${this.cookieService.get("userEmail")}`);
  }

  setUserstacks(): Observable<Userstacks>{
    let header: HttpHeaders = new HttpHeaders();
    return this.client.post<Userstacks>(`${API.HttpsBaseURL}/gradstacks/add?email=${this.cookieService.get("userEmail")}`, {headers: header, responseType: 'text'});
  }

  updateUserstacks(userstacks: Userstacks): Observable<Userstacks>{
    let header: HttpHeaders = new HttpHeaders();
    let update ={
      description: userstacks.description
    }
    return this.client.put<Userstacks>(`${API.HttpsBaseURL}/gradstacks/update?email=${this.cookieService.get("userEmail")}`,update, {headers: header});
  }

  public CaptureEvent(page: string, selectedItem: EventEmitter<{ selectedPage: string }>) {
    selectedItem.emit({
      selectedPage: page
    });
  }
}
