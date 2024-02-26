import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.interface';
import { EmployeeProfile } from '../../models/employee-profile.interface';
import { environment } from '../../../environments/environment';
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
    this.baseUrl = `${environment.HttpsBaseURL}/employees`
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
  getAll(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/all`);
  }

  /**
 * @summary  Gets all the Full Employee DTO and information
 *
 * @returns Array of EmployeeProfile objects.
 */
  getEmployeeProfiles(): Observable<EmployeeProfile[]> {
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}/all`);
  }

  addEmployee(newEmployee: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, newEmployee);
  }

  get(email: string): Observable<EmployeeProfile> {
    return this.httpClient.get<EmployeeProfile>(`${this.baseUrl}/by-email?email=${encodeURIComponent(email)}`);
  }

  updateEmployee(employee: any): Observable<any> {
    const queryParams = `?userEmail=${this.authAccessService.getEmployeeEmail()}`
    return this.httpClient.put<any>(`${this.baseUrl}${queryParams}`, employee)
  }

  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  getChurnRate(): Observable<ChurnRateDataCard> {
    return this.httpClient.get<ChurnRateDataCard>(`${this.baseUrl}/churn-rate`);
  }

  getEmployeeCountData(): Observable<EmployeeCountDataCard> {
    return this.httpClient.get<EmployeeCountDataCard>(`${this.baseUrl}/card-count`);
  }
  /**
  * @summary  Gets List of employees by filtering based on parameters.
  * to exclude a parameter from the filter pass through a 0 for said parameter
  * @param  championID filters those that have the same CHampion ID
  * @param employeeType filters by the type of employee
  *
  * @returns List of EmployeeDto objects.
  */
  filterEmployees(championID: number, employeeType: number): Observable<EmployeeProfile[]> {
    var queryParams = `?PeopleChampId=${encodeURIComponent(championID)}`
    queryParams += `&employeeType=${encodeURIComponent(employeeType)}`
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}/filter-employees${queryParams}`);
  }
}
