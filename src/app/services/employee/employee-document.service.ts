import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeDocument } from "src/app/models/employeeDocument.interface";
import { HttpClient } from '@angular/common/http';
import { API } from '../../models/constants/urls.constants';

@Injectable({
    providedIn: 'root'
})

export class EmployeeDocumentService {
    baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${API.HttpsBaseURL}/employee-documents`
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