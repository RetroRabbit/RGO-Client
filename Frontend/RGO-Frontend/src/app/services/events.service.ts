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
  constructor(private client: HttpClient) { }

  getAllEvents(): Observable<Events[]>{
    return this.client.get<Events[]>(`${API.HttpsBaseURL}/event/events`);
  }

}
