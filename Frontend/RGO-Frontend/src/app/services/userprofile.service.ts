import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Events } from '../models/events.interface';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  constructor(private client: HttpClient) { }

  GetUserProfile(token : any): Observable<Events[]>{
    let header: HttpHeaders = new HttpHeaders()
    header = header.append('Authorization',`Bearer ${token}`)
    header = header.append('Content-Type','application/json')
    return this.client.get<Events[]>(`${API.HttpsBaseURL}/Events/events`, {headers: header});
  }
}
