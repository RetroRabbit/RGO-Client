import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../../models/hris/employee.interface';
import { EmployeeProfile } from '../../../models/hris/employee-profile.interface';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';
import { EmployeeFilterView } from 'src/app/models/hris/employee-filter-view.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  baseUrl: string;

  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) {
    this.baseUrl = `${environment.HttpsBaseURL}/employees`
  }

  getEmployeeById(id: number): Observable<EmployeeProfile> {
    const queryParams = `?id=${id}`;
    return this.httpClient.get<EmployeeProfile>(`${this.baseUrl}${queryParams}`);
  }

  getSimpleEmployee(employeeEmail : string): Observable<SimpleEmployee> {
    const queryParams = `?employeeEmail=${employeeEmail}`;
    return this.httpClient.get<SimpleEmployee>(`${this.baseUrl}/simple-profile${queryParams}`);
  }

  getEmployeeProfileDetailsById(id: number): Observable<EmployeeProfileDetails> {
    const queryParams = `?id=${id}`;
    return this.httpClient.get<EmployeeProfileDetails>(`${this.baseUrl}/profile-details${queryParams}`);
  }

  getAll(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/all`);
  }

  getEmployeeProfiles(): Observable<EmployeeProfile[]> {
    return this.httpClient.get<EmployeeProfile[]>(`${this.baseUrl}/all`);
  }

  addEmployee(newEmployee: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, newEmployee);
  }

  getEmployeeProfileByEmail(email: string): Observable<EmployeeProfile> {
    return this.httpClient.get<EmployeeProfile>(`${this.baseUrl}/by-email?email=${encodeURIComponent(email)}`);

  }

  checkDuplicateIdNumber(idNumber: string, employeeId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/id-number?idNumber=${encodeURIComponent(idNumber)}&employeeId=${employeeId}`);
  }

  updateEmployee(employee: any): Observable<any> {
    const queryParams = `?userEmail=${this.authAccessService.getEmployeeEmail()}`
    return this.httpClient.put<any>(`${this.baseUrl}${queryParams}`, employee)
  }

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
