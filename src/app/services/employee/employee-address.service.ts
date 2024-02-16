import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/models/constants/urls.constants';
import { EmployeeAddress } from 'src/app/models/employee-address.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAddressService {

 baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${API.HttpsBaseURL}/employee-documents`
    }

  getall(): Observable<EmployeeAddress[]> {
    return this.httpClient.get<EmployeeAddress[]>(`${this.baseUrl}`);
  }

  save(address: EmployeeAddress): Observable<EmployeeAddress> {
    return this.httpClient.post<EmployeeAddress>(`${this.baseUrl}`, address);
  }

  update(address: EmployeeAddress): Observable<EmployeeAddress> {
    return this.httpClient.put<EmployeeAddress>(`${this.baseUrl}`, address);
  }

  delete(addressId: EmployeeAddress): Observable<EmployeeAddress> {
    return this.httpClient.delete<EmployeeAddress>(`${this.baseUrl}/${addressId}`);
  }
}
