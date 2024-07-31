import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { Token } from '../../../models/hris/token.interface';
import { Store } from '@ngrx/store';
import { EmployeeState } from '../../../components/shared-components/store/reducers/employee.reducer';
import { CookieService } from 'ngx-cookie-service';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  updateProfilePhoto(email: string | undefined, photo: string) {
    throw new Error('Method not implemented.');
  }
  email: string = '';
  token: string = '';
  cookieEmail = this.cookieService.get('userEmail');
  constructor(private client: HttpClient, 
              private appStore:Store<{app:Token}>, 
              private employeeStore:Store<{employees:EmployeeState}>, 
              private cookieService: CookieService) { }

  GetEmployeeProfile(): Observable<EmployeeProfile> {
    let result = this.client.get<EmployeeProfile>(`${environment.HttpsBaseURL}/employees`);
    return result;
  }

  GetEmployeeProfileByEmail(email: string): Observable<EmployeeProfile> {
    const queryParams = `?email=${email}`;
    return this.client.get<EmployeeProfile>(`${environment.HttpsBaseURL}/employees/by-email${queryParams}`);
  }


  getToken() {
    this.employeeStore.select('employees').subscribe(state => {
        this.email = state.selectedEmployee.email!;
    });

    this.appStore.select('app').subscribe(state => {
      this.token = state.token;
      if (this.email != '' || this.email) {
        return;
      }
      this.email = state.email;
    })
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
