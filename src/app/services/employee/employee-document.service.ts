import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeDocument } from "src/app/models/hris/employeeDocument.interface";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/environment';

@Injectable({
    providedIn: 'root'
})

export class EmployeeDocumentService {
    baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${environment.HttpsBaseURL}/employee-documents`
    }

    getAllEmployeeDocuments(employeeId: number): Observable<EmployeeDocument[]> {
        return this.httpClient.get<EmployeeDocument[]>(`${this.baseUrl}/${employeeId}`);
    }
    saveEmployeeDocument(employeeDocument: any): Observable<EmployeeDocument> {
        return this.httpClient.post<EmployeeDocument>(`${this.baseUrl}`, employeeDocument);
    }
    getEmployeeDocument(employeeId: number, filename: string): Observable<EmployeeDocument> {
        return this.httpClient.get<EmployeeDocument>(`${this.baseUrl}?employeeId=${employeeId}?filename=${filename}`);
    }
    updateEmployeeDocument(employeeDocument: EmployeeDocument): Observable<EmployeeDocument> {
        return this.httpClient.put<EmployeeDocument>(`${this.baseUrl}`, employeeDocument);
    }
    deleteEmployeeDocument(employeeDocumentId: number): Observable<EmployeeDocument> {
        return this.httpClient.delete<EmployeeDocument>(`${this.baseUrl}/${employeeDocumentId}`);
    }
};