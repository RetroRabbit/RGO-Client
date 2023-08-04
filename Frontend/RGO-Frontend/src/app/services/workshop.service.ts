import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { Workshop } from '../models/Workshop.interface';
import { Token } from '../models/token.interface';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  token: string = '';
  constructor(private client: HttpClient,private appStore : Store<{app : Token}>) { }

  getAllWorkshops(): Observable<Workshop[]>{
    this.getToken();
    let header: HttpHeaders = new HttpHeaders() 
    header = header.append('Authorization',`Bearer ${this.token}`)
    header = header.append('Content-Type','application/json')
    return this.client.get<Workshop[]>(`${API.HttpsBaseURL}/Workshop/workshops`, {headers: header});
  }

  getToken(){
    this.appStore.select('app').subscribe( state => {
      this.token = state.token;
    })
  }
}
