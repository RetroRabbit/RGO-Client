import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAddressService {

 baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${environment.HttpsBaseURL}/employee-documents`
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
