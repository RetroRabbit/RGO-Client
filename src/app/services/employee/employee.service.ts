import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.interface';
import { EmployeeProfile } from '../../models/employee-profile.interface';
import { API } from '../../models/constants/urls.constants';
import { ChurnRateDataCard } from 'src/app/models/churn-rate-data-card.interface';
import { EmployeeCountDataCard } from 'src/app/models/employee-count-data-card.interface';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl: string;
  
  constructor(private httpClient: HttpClient) { 
    this.baseUrl =`${API.HttpsBaseURL}/employees`
  }

   /**
 * @summary  Gets the Basic Employee information ie.  
 *  id
 *  name
 *  surname
 *  email
 *  joinDate
 *
 * @returns List of Basic Employee objects.
 */
  getAll(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${this.baseUrl}`);
  }
  /**
 * @summary  Gets all the Full Employee DTO and information
 *
 * @returns List of Employee DTO objects.
 */
  getAllProfiles(): Observable<EmployeeProfile[]>{
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}`);
  }

  addEmployee(newEmployee: any): Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}`, newEmployee);
  }

  get(email: string): Observable<EmployeeProfile> {
    return this.httpClient.get<EmployeeProfile>(`${this.baseUrl}?email=${encodeURIComponent(email)}`);
  }

  updateEmployee(employee: any): Observable<any>{
    return this.httpClient.put<any>(`${this.baseUrl}`, employee)
  }

  filterEmployeesByType(type: string): Observable<EmployeeProfile[]> {
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}/filter-by-type?type=${encodeURIComponent(type)}`)
  }

  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${API.HttpBaseURL}/employee/employees/count`);
  }

  getChurnRate(): Observable<ChurnRateDataCard> {
    return this.httpClient.get<ChurnRateDataCard>(`${API.HttpBaseURL}/employee/employees/churnrate`);
  }

  getDevsDesignerCount(): Observable<EmployeeCountDataCard> {
    return this.httpClient.get<EmployeeCountDataCard>(`${API.HttpBaseURL}/employee/employees/data/count`);
  }
}
