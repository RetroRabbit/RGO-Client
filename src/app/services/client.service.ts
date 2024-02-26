import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
=======
import { environment } from '../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c
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
