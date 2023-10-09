import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeType } from '../../models/employee-type.model';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {

  constructor(private httpClient: HttpClient) {}

    getAllEmployeeTypes(): Observable<EmployeeType[]>{
      return this.httpClient.get<EmployeeType[]>(`${API.HttpBaseURL}/employeetype/types`);
    }
   
  
}
