import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeFilterView } from 'src/app/models/hris/employee-filter-view.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/employees`
  }

  getSimpleEmployeeProfiles(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/simple-profile/all`);
  }

  getSimpleEmployeeProfileByEmail(employeeEmail : string): Observable<any> {
    const queryParams = `?employeeEmail=${employeeEmail}`;
    return this.httpClient.get<any>(`${this.baseUrl}/simple-profile${queryParams}`);
  }

  addEmployee(newEmployee: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, newEmployee);
  }

  checkDuplicateIdNumber(idNumber: string, employeeId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/id-number?idNumber=${encodeURIComponent(idNumber)}&employeeId=${employeeId}`);
  }

  updateEmployee(employee: any): Observable<any> {
    const queryParams = `?userEmail=${employee.email}`
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
