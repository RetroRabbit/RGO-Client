import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeSalary } from 'src/app/models/hris/employee-salary.interface';
import { EmployeeTermination } from 'src/app/models/hris/employeeTermination.interface';

@Injectable({
    providedIn: 'root'
})
export class EmployeeTerminationService {
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = `${environment.HttpsBaseURL}/termination`
    }
    
    saveEmployeeTermination(EmployeeTermination: EmployeeTermination): Observable<EmployeeTermination> {
        return this.httpClient.post<EmployeeTermination>(`${this.baseUrl}`, EmployeeTermination);
    }
    
    updateEmployeeTermination(employeeSalary: any): Observable<EmployeeTermination> {
        return this.httpClient.put<EmployeeTermination>(`${this.baseUrl}`, employeeSalary);
    }

}