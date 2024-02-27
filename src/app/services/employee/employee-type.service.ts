import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeType } from '../../models/employee-type.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {

  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/employee-types`
  }

    getAllEmployeeTypes(): Observable<EmployeeType[]>{
      return this.httpClient.get<EmployeeType[]>(`${this.baseUrl}`);
    }
}