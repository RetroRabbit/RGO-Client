import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeBankingandstarterkitService {

  baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${environment.HttpsBaseURL}/banking-starterkits`
    }

    getAllBankingAndStarterkits(): Observable<any[]> {
      return this.httpClient.get<any[]>(`${this.baseUrl}`);
    }
}