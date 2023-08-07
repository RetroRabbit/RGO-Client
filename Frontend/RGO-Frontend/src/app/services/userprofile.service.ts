import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Events } from '../models/events.interface';
import { API } from '../models/constants/urls.constants';
import { User } from '../models/userprofile.interface';
import { Token } from '../models/token.interface';
import { Store } from '@ngrx/store';
import { GetUserProfile } from '../store/actions/userprofile.actions';


@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  token: string = '';
  constructor(private client: HttpClient,private appStore:Store<{app:Token}>) { }

  GetUserProfile(email: string ,token : string): Observable<User>{
    this.getToken();
    let header: HttpHeaders = new HttpHeaders()
    header = header.append('Authorization',`Bearer ${this.token}`)
    header = header.append('Content-Type','application/json')
    
    return this.client.get<User>(`${API.HttpsBaseURL}/Profile/getuser?email=${email}`, {headers : header})
  }

  getToken(){
    this.appStore.select('app').subscribe( state => {
      this.token = state.token;
    })
  }
}



