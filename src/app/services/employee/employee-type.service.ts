import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeType } from '../../models/employee-type.model';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { environment } from '../../../environments/environment';
=======
import { environment } from '../../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c

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