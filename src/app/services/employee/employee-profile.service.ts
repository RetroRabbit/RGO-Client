import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';
import { EmployeeProfile } from '../../models/employee-profile.interface';
import { Token } from '../../models/token.interface';
import { Store } from '@ngrx/store';
import { EmployeeState } from '../../store/reducers/employee.reducer';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  email: string = '';
  token: string = '';
  cookieEmail = this.cookieService.get('userEmail');
  constructor(private client: HttpClient,private appStore:Store<{app:Token}>, private employeeStore:Store<{employees:EmployeeState}>, private cookieService: CookieService) { }

  GetEmployeeProfile(): Observable<EmployeeProfile> {

    return this.client.get<EmployeeProfile>(`${API.HttpsBaseURL}/employee/get`);
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
    console.log(profileUpdate.updatedProfile.email)
    return this.client.put<any>(
      `${API.HttpsBaseURL}/employee/update?email=${profileUpdate.updatedProfile.email}`, profileUpdate.updatedProfile
    );
  }

  getAllEmployees(name: string): Observable<EmployeeProfile[]> {
    const queryParams = `?name=${name}`;
    return this.client.get<EmployeeProfile[]>(`${API.HttpsBaseURL}/employee/search${queryParams}`);
  }
}