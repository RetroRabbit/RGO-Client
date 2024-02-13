import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.interface';
import { EmployeeProfile } from '../../models/employee-profile.interface';
import { API } from '../../models/constants/urls.constants';
import { AuthAccessService } from '../auth-access.service';
import { ChurnRateDataCard } from 'src/app/models/churn-rate-data-card.interface';
import { EmployeeCountDataCard } from 'src/app/models/employee-count-data-card.interface';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl: string;
  
  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) { 
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
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/all`);
  }
  /**
 * @summary  Gets all the Full Employee DTO and information
 *
 * @returns List of Employee DTO objects.
 */
  getAllProfiles(): Observable<EmployeeProfile[]>{
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}/all`);
  }

  addEmployee(newEmployee: any): Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}`, newEmployee);
  }

  get(email: string): Observable<EmployeeProfile> {
    return this.httpClient.get<EmployeeProfile>(`${this.baseUrl}/by-email?email=${encodeURIComponent(email)}`);
  }

  updateEmployee(employee: any): Observable<any>{
    const queryParams = `?userEmail=${this.authAccessService.getEmployeeEmail()}`
    return this.httpClient.put<any>(`${this.baseUrl}/update/${queryParams}`, employee)
  }

  filterEmployeesByType(type: string): Observable<EmployeeProfile[]> {
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}/filter-by-type?type=${encodeURIComponent(type)}`)
  }

  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  getChurnRate(): Observable<ChurnRateDataCard> {
    return this.httpClient.get<ChurnRateDataCard>(`${this.baseUrl}/churn-rate`);
  }

  getDevsDesignerCount(): Observable<EmployeeCountDataCard> {
    return this.httpClient.get<EmployeeCountDataCard>(`${this.baseUrl}/card-count`);
  }
}
