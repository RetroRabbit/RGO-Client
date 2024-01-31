import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeBanking } from "src/app/models/employee-banking.interface";
import { HttpClient } from '@angular/common/http';
import { API } from '../../models/constants/urls.constants';

@Injectable({
    providedIn: 'root'
  })


export class EmployeeBankingService{

    constructor(private httpClient : HttpClient){}

    getPending(status : number): Observable<EmployeeBanking[]>{
        return this.httpClient.get<EmployeeBanking[]>(`${API.HttpsBaseURL}/employeebanking/get?status=${status}`);
    }

    updatePending(updatedEntry : any) :Observable<any> {
        return this.httpClient.put<EmployeeBanking[]>(`${API.HttpsBaseURL}/employeebanking/update`, updatedEntry);
    }

    getBankingDetails(id: number | undefined): Observable<EmployeeBanking> {
      return this.httpClient.get<EmployeeBanking>(`${API.HttpsBaseURL}/employeebanking/getDetails?id=${id}`)
    }

    addBankingDetails(newEntry : EmployeeBanking): Observable<EmployeeBanking> {
    return this.httpClient.post<EmployeeBanking>(`${API.HttpsBaseURL}/employeebanking/add`, newEntry);
    }
}