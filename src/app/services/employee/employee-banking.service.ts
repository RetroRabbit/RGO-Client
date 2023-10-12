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

    getPending(): Observable<EmployeeBanking[]>{
        return this.httpClient.get<EmployeeBanking[]>(`${API.HttpBaseURL}/employeeBanking/getPending`);
    }

    updatePending(updatedEntry : any) :Observable<any> {
        return this.httpClient.put<EmployeeBanking[]>(`${API.HttpBaseURL}/employeeBanking/updatePending`, updatedEntry);
    }
}