import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';
import { EmployeeData } from '../../models/employee-data.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {
  baseUrl: string;
  
  constructor(private httpClient: HttpClient) { 
    this.baseUrl =`${API.HttpsBaseURL}/employee-data`
  }

  getEmployeeData(employeeId: number | undefined): Observable<EmployeeData[]>{
    const queryParams = `?id=${employeeId}`;
    return this.httpClient.get<EmployeeData[]>(`${this.baseUrl}${queryParams}`);
  }

  updateEmployeeData(employeeData: EmployeeData): Observable<EmployeeData>{
    return this.httpClient.put<EmployeeData>(`${this.baseUrl}`, employeeData)
  }

  saveEmployeeData(employeeData: any): Observable<EmployeeData>{
    return this.httpClient.post<EmployeeData>(`${this.baseUrl}`, employeeData)
  }

  deleteEmployeeDocument(employeeDataId: number): Observable<EmployeeData> {
    return this.httpClient.delete<EmployeeData>(`${this.baseUrl}/${employeeDataId}`);
}
}
