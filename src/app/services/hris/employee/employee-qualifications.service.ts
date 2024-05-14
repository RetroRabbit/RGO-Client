import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeAddress } from 'src/app/models/hris/employee-address.interface';
import { EmployeeQualifications } from 'src/app/models/hris/employee-qualifications.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeQualificationsService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/employee-qualifications`
  }
  update(address: EmployeeQualifications): Observable<EmployeeQualifications> {
    return this.httpClient.put<EmployeeQualifications>(`${this.baseUrl}`, address);
  }

}
