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
  constructor(private client: HttpClient) { }

  getAllWorkshops(): Observable<Workshop[]>{
    return this.client.get<Workshop[]>(`${API.HttpsBaseURL}/Workshop/workshops`);
  }
}
