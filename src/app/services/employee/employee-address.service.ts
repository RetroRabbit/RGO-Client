import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Address } from "src/app/models/address.interface";
import { API } from '../../models/constants/urls.constants';

@Injectable({
    providedIn: 'root'
  })


export class EmployeeAddressService{

    constructor(private httpClient : HttpClient){}

    get(id : number): Observable<Address>{
        return this.httpClient.get<Address>(`${API.HttpBaseURL}/employeeaddress/get?id=${id}`);
    }
}