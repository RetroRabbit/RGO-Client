import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeQualificationsService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/employee-qualifications`
  }

  saveEmployeeQualification(employeeQualification: any): Observable<EmployeeQualifications> {
    return this.httpClient.post<EmployeeQualifications>(`${this.baseUrl}`, employeeQualification);
  }

  updateEmployeeQualification(employeeDocument: EmployeeQualifications, employeeQualificationId: number): Observable<EmployeeQualifications> {
    return this.httpClient.put<EmployeeQualifications>(`${this.baseUrl}/${employeeQualificationId}`, employeeDocument);
  }

  getAllEmployeeQualifications(): Observable<EmployeeQualifications[]> {
    return this.httpClient.get<EmployeeQualifications[]>(`${this.baseUrl}`);
  }

  getEmployeeQualificationById(employeeId: number): Observable<EmployeeQualifications> {
    return this.httpClient.get<EmployeeQualifications>(`${this.baseUrl}/${employeeId}`);
  }

  deleteEmployeeQualification(employeeQualificationId: number): Observable<EmployeeQualifications> {
    return this.httpClient.delete<EmployeeQualifications>(`${this.baseUrl}/${employeeQualificationId}`);
  }
}
