import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeSalary } from 'src/app/models/hris/employee-salary.interface';

@Injectable({
    providedIn: 'root'
})
export class EmployeeSalaryService {
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = `${environment.HttpsBaseURL}/employee-salary`
    }

    deleteEmployeeSalary(employeeId: number): Observable<EmployeeSalary> {
        return this.httpClient.delete<EmployeeSalary>(`${this.baseUrl}?employeeId=${employeeId}`);
    }

    getAllEmployeeSalaries(): Observable<EmployeeSalary[]> {
        return this.httpClient.get<EmployeeSalary[]>(`${this.baseUrl}/all`);
    }

    getEmployeeSalary(employeeId: number): Observable<EmployeeSalary> {
        return this.httpClient.get<EmployeeSalary>(`${this.baseUrl}/${employeeId}`);
    }

    saveEmployeeSalary(employeeSalary: any): Observable<EmployeeSalary> {
        return this.httpClient.post<EmployeeSalary>(`${this.baseUrl}`, employeeSalary);
    }

    updateEmployeeSalary(employeeSalary: any): Observable<EmployeeSalary> {
        return this.httpClient.put<EmployeeSalary>(`${this.baseUrl}`, employeeSalary);
    }
}