import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { EmployeeData } from '../models/employee-data.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {

  constructor(private httpClient: HttpClient) { }

  getEmployeeData(employeeId: number | undefined): Observable<EmployeeData[]>{
    const queryParams = `?id=${employeeId}`;
    return this.httpClient.get<EmployeeData[]>(`${API.HttpsBaseURL}/employeedata/get${queryParams}`);
  }

  updateEmployeeData(employeeData: EmployeeData): Observable<EmployeeData>{
    return this.httpClient.put<EmployeeData>(`${API.HttpsBaseURL}/employeedata/update`, employeeData)
  }

  saveEmployeeData(employeeData: any): Observable<EmployeeData>{
    return this.httpClient.post<EmployeeData>(`${API.HttpsBaseURL}/employeedata/save`, employeeData)
  }
}
