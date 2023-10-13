import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { EmployeeDateInput } from '../models/employe-date.interface';
import { EmployeeDate } from '../models/employee-date.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDateService {

  constructor(private httpClient: HttpClient) { }

  saveEmployeeDate(employeeDateInput: EmployeeDateInput): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/employeedate/save`, employeeDateInput);
  }

  deleteEmployeeDate(employeeDateInput: EmployeeDateInput): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/employeedate/delete`, { body: employeeDateInput });
  }

  updateEmployeeDate(employeeDate: EmployeeDate): Observable<any> {
    return this.httpClient.put<any>(`${API.HttpBaseURL}/employeedate/update`, employeeDate);
  }

  getall(email: string | null = null, subject: string | null = null, date: Date | null = null): Observable<EmployeeDate[]> {
    let queryParams = [];

    if (email !== null) queryParams.push(`email=${email}`);
    if (subject !== null) queryParams.push(`subject=${subject}`);
    if (date !== null) queryParams.push(`date=${date.toISOString().split('T')[0]}`);

    const queryString = queryParams.length ? '?' + queryParams.join('&') : '';
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeedate/getall${queryString}`);
  }
}
