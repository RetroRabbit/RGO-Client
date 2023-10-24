import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/models/constants/urls.constants';
import { EmployeeAddress } from 'src/app/models/employee-address.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAddressService {

  constructor(private client: HttpClient) { }

  getall(): Observable<EmployeeAddress[]> {
    return this.client.get<EmployeeAddress[]>(`${API.HttpsBaseURL}/employeeaddress/getall`);
  }

  save(address: EmployeeAddress): Observable<EmployeeAddress> {
    return this.client.post<EmployeeAddress>(`${API.HttpsBaseURL}/employeeaddress/save`, address);
  }

  update(address: EmployeeAddress): Observable<EmployeeAddress> {
    console.table(address);
    return this.client.put<EmployeeAddress>(`${API.HttpsBaseURL}/employeeaddress/update`, address);
  }

  delete(address: EmployeeAddress): Observable<EmployeeAddress> {
    return this.client.delete<EmployeeAddress>(`${API.HttpsBaseURL}/employeeaddress/delete/`, { body: address });
  }
}
