import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../models/constants/urls.constants';
import { Client } from '../models/client.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${API.HttpsBaseURL}/clients`
  }


  getAllClients(): Observable<Client[]>{
    return this.httpClient.get<Client[]>(`${this.baseUrl}`);
  }
}
