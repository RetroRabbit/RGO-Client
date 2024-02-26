import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeBanking } from "src/app/models/employee-banking.interface";
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { environment } from '../../../environments/environment';
=======
import { environment } from '../../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c

@Injectable({
    providedIn: 'root'
  })

export class EmployeeBankingService{
  baseUrl: string;
  
    constructor(private httpClient : HttpClient){
      this.baseUrl =`${environment.HttpsBaseURL}/employee-banking`
    }

    getPending(status : number): Observable<EmployeeBanking[]>{
        return this.httpClient.get<EmployeeBanking[]>(`${this.baseUrl}?status=${status}`);
    }

    updatePending(updatedEntry : any) :Observable<any> {
        return this.httpClient.put<EmployeeBanking[]>(`${this.baseUrl}`, updatedEntry);
    }

    getBankingDetails(id: number | undefined): Observable<EmployeeBanking> {
      return this.httpClient.get<EmployeeBanking>(`${this.baseUrl}/details?id=${id}`)
    }

    addBankingDetails(newEntry : EmployeeBanking): Observable<EmployeeBanking> {
    return this.httpClient.post<EmployeeBanking>(`${this.baseUrl}`, newEntry);
    }
}