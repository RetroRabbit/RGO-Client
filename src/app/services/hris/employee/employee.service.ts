import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../../models/hris/employee.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';
import { EmployeeFilterView } from 'src/app/models/hris/employee-filter-view.interface';


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
  /**
  * @summary  Adds employee and Full Employee DTO and information
  * @param newEmployee new employee dto to be added
  */
  addEmployee(newEmployee: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, newEmployee);
  }
  /**
* @summary  Gets all the Full Employee DTO and information by email
*
* @returns EmployeeProfile object.
*/
  get(email: string): Observable<EmployeeProfile> {
    return this.httpClient.get<EmployeeProfile>(`${this.baseUrl}/by-email?email=${encodeURIComponent(email)}`);
  }
  /**
* @summary  Checks for duplicate id number
* @param idNumber idnumber that needs to be checked
*/
  checkDuplicateIdNumber(idNumber: string, employeeId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/id-number?idNumber=${encodeURIComponent(idNumber)}&employeeId=${employeeId}`);
  }
  /**
* @summary  
* @param employee updated employee object
*/
  updateEmployee(employee: any): Observable<any> {
    const queryParams = `?userEmail=${this.authAccessService.getEmployeeEmail()}`
    return this.httpClient.put<any>(`${this.baseUrl}${queryParams}`, employee)
  }
  /**
 * @summary  Checks for duplicate id number
 *
 */
  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  /**
  * @summary  Gets List of employees by filtering based on parameters.
  * to exclude a parameter from the filter pass through a 0 for said parameter
  * @param  championID filters those that have the same CHampion ID
  * @param employeeType filters by the type of employee
  * @param activeStatus filters by the active statys of emplyee
  *
  * @returns List of EmployeeDto objects.
  */
  filterEmployees(championID: number, employeeType: number, activeStatus: boolean = true): Observable<EmployeeFilterView[]> {
    const queryParams = `?PeopleChampId=${encodeURIComponent(championID)}
                        &employeeType=${encodeURIComponent(employeeType)}
                        &activeStatus=${activeStatus}`;
    return this.httpClient.get<EmployeeFilterView[]>(`${this.baseUrl}/filter-employees${queryParams}`);
  }
}