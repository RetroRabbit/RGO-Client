import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/environment';
import { EmployeeDateInput } from '../../../models/hris/employe-date.interface';
import { EmployeeDate } from '../../../models/hris/employee-date.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDateService {
  baseUrl: string;
  
  constructor(private httpClient: HttpClient) { 
    this.baseUrl =`${environment.HttpsBaseURL}/employee-date`
  }

  saveEmployeeDate(employeeDateInput: EmployeeDateInput): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, employeeDateInput);
  }

  deleteEmployeeDate(employeeDateId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}?employeeDateId=${employeeDateId}`);
  }

  updateEmployeeDate(employeeDate: EmployeeDate): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}`, employeeDate);
  }

  getall(email: string | null = null, subject: string | null = null, date: Date | null = null): Observable<EmployeeDate[]> {
    let queryParams = [];

    if (email !== null) queryParams.push(`email=${email}`);
    if (subject !== null) queryParams.push(`subject=${subject}`);
    if (date !== null) queryParams.push(`date=${date.toISOString().split('T')[0]}`);

    const queryString = queryParams.length ? '?' + queryParams.join('&') : '';
    return this.httpClient.get<any[]>(`${this.baseUrl}/${queryString}`);
  }
}
