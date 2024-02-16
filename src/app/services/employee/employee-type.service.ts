import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeType } from '../../models/employee-type.model';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {

  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.Https_Base_URL}/employee-types`
  }

    getAllEmployeeTypes(): Observable<EmployeeType[]>{
      return this.httpClient.get<EmployeeType[]>(`${this.baseUrl}`);
    }
}