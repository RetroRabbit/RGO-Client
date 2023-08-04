import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Userstacks } from '../models/userstacks.interface';
import { API } from '../models/constants/urls.constants';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class UserstacksService {
  token: string = '';
  email: string = '';

  constructor(private client: HttpClient, private store: Store<{app: Token}> ) { }

  getUserstacks(): Observable<Userstacks>{
    this.getToken();
    this.getEmail();
    let header: HttpHeaders = new HttpHeaders()
    header = header.append('Authorization', `Bearer ${this.token}`)
    header = header.append('Content-Type', 'application/json')
    return this.client.get<Userstacks>(`${API.HttpsBaseURL}/UserStack/GetUserStack?email=${encodeURIComponent(this.email)}`,{headers: header});
  }

  getToken(){
    this.store.select('app').subscribe( state => {
     this.token = state.token;
    })
  }

  getEmail(){
    this.store.select('app').subscribe( state => {
      this.email = state.email;
    })
  }
      
}