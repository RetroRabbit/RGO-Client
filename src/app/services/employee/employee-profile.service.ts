import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';
import { EmployeeProfile } from '../../models/employee-profile.interface';
import { Token } from '../../models/token.interface';
import { Store } from '@ngrx/store';
import { EmployeeState } from '../../store/reducers/employee.reducer';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs';
import { SimpleEmployee } from 'src/app/models/simple-employee-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  email: string = '';
  token: string = '';
  cookieEmail = this.cookieService.get('userEmail');
  constructor(private client: HttpClient, 
              private appStore:Store<{app:Token}>, 
              private employeeStore:Store<{employees:EmployeeState}>, 
              private cookieService: CookieService) { }

  GetEmployeeProfile(): Observable<EmployeeProfile> {
    let result = this.client.get<EmployeeProfile>(`${API.HttpsBaseURL}/employees`);
    return result;
  }

  GetEmployeeProfileByEmail(email: string): Observable<EmployeeProfile> {
    const queryParams = `?email=${email}`;
    return this.client.get<EmployeeProfile>(`${API.HttpsBaseURL}/employees/by-email${queryParams}`);
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
      `${API.HttpsBaseURL}/employees?email=${profileUpdate.updatedProfile.email}`, profileUpdate.updatedProfile
    );
  }

  searchEmployees(name: string): Observable<EmployeeProfile[]> {
    const queryParams = `?name=${name}`;
    return this.client.get<EmployeeProfile[]>(`${API.HttpsBaseURL}/employees${queryParams}`);
  }

  getEmployeeById(id: number): Observable<EmployeeProfile> {
    const queryParams = `?id=${id}`;
    return this.client.get<EmployeeProfile>(`${API.HttpsBaseURL}/employees${queryParams}`);
  }

  getSimpleEmployee(employeeEmail : string): Observable<SimpleEmployee> {
    const queryParams = `?employeeEmail=${employeeEmail}`;
    return this.client.get<SimpleEmployee>(`${API.HttpsBaseURL}/employees/simple-profile/${queryParams}`);
  }

  /*updateProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<any>(`${API.HttpsBaseURL}/employees/update-photo`, formData);
  }
}*/
/*
  updateProfilePhoto() {
    this.employeeProfile.photo = "";

    this.employeeProfileService.UpdateEmployeeProfile(this.GetEmployeeProfile).subscribe({
      next: () => {
       if(this.authAccessService.isAdmin() ||
          this.authAccessService.isSuperAdmin() ||
          this.authAccessService.isJourney() ||
          this.authAccessService.isTalent() ){
             
            this.getSelectedEmployee()
            this.usingSimpleProfile = false;
          } else {
            this.getSimpleEmployee();
            this.usingSimpleProfile = true;
          }
      },
      error: () =>
      this.snackBarService.showSnackbar("Erro updating profile", "snack-error")
    })
  }
  getSelectedEmployee() {
    throw new Error('Method not implemented.');
  }
  */
}