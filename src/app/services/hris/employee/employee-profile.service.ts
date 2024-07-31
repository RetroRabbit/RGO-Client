import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeProfile } from '../../../models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  
  constructor(private client: HttpClient) { }

  GetEmployeeProfile(): Observable<EmployeeProfile> {
    let result = this.client.get<EmployeeProfile>(`${environment.HttpsBaseURL}/employees`);
    return result;
  }

  GetEmployeeProfileByEmail(email: string): Observable<EmployeeProfile> {
    const queryParams = `?email=${email}`;
    return this.client.get<EmployeeProfile>(`${environment.HttpsBaseURL}/employees/by-email${queryParams}`);
  }

  UpdateEmployeeProfile(profileUpdate: any): Observable<any> {
    return this.client.put<any>(
      `${environment.HttpsBaseURL}/employees?email=${profileUpdate.updatedProfile.email}`, profileUpdate.updatedProfile
    );
  }

  searchEmployees(name: string): Observable<EmployeeProfile[]> {
    const queryParams = `?name=${name}`;
    return this.client.get<EmployeeProfile[]>(`${environment.HttpsBaseURL}/employees${queryParams}`);
  }

  getEmployeeById(id: number): Observable<EmployeeProfile> {
    const queryParams = `?id=${id}`;
    return this.client.get<EmployeeProfile>(`${environment.HttpsBaseURL}/employees${queryParams}`);
  }

  getSimpleEmployee(employeeEmail : string): Observable<SimpleEmployee> {
    const queryParams = `?employeeEmail=${employeeEmail}`;
    return this.client.get<SimpleEmployee>(`${environment.HttpsBaseURL}/employees/simple-profile/${queryParams}`);
  }
}
