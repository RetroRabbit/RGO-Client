import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroment/environment';
import { Client } from '../models/client.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/clients`
  }


  getAllClients(): Observable<Client[]>{
    return this.httpClient.get<Client[]>(`${this.baseUrl}`);
  }
}
