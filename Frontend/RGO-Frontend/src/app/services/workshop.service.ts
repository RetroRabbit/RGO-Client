import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { Workshop } from '../models/Workshop.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private client: HttpClient) { }

  getAllWorkshops(token: string): Observable<Workshop[]>{
    let header: HttpHeaders = new HttpHeaders() 
    header = header.append('Authorization',`Bearer ${token}`)
    header = header.append('Content-Type','application/json')
    return this.client.get<Workshop[]>(`${API.HttpsBaseURL}/Workshop/workshops`, {headers: header});
  }
}
