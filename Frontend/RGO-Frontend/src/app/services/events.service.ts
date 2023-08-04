import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Events } from '../models/events.interface';
import { API } from '../models/constants/urls.constants';
import { Token } from '../models/token.interface';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  token: string = '';
  constructor(private client: HttpClient,private appStore : Store<{app : Token}>) { }

  getAllEvents(): Observable<Events[]>{
    this.getToken();
    let header: HttpHeaders = new HttpHeaders() 
    header = header.append('Authorization',`Bearer ${this.token}`)
    header = header.append('Content-Type','application/json')
    return this.client.get<Events[]>(`${API.HttpsBaseURL}/Events/events`, {headers: header});
  }

  getToken(){
    this.appStore.select('app').subscribe( state => {
      this.token = state.token;
    })
  }

}
