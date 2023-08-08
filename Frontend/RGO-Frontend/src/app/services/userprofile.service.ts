import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { UserProfile } from '../models/userprofile.interface';
import { Token } from '../models/token.interface';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {
  email: string ='';
  token: string = '';
  constructor(private client: HttpClient,private appStore:Store<{app:Token}>) { }

  GetUserProfile(): Observable<UserProfile>{
    this.getToken();
    let header: HttpHeaders = new HttpHeaders()
    header = header.append('Authorization',`Bearer ${this.token}`)
    header = header.append('Content-Type','application/json')
    
    return this.client.get<UserProfile>(`${API.HttpsBaseURL}/profile/get?email=${this.email}`, {headers : header})
  }

  getToken(){
    this.appStore.select('app').subscribe( state => {
      this.token = state.token;
      this.email=state.email;
    })
  }
}



