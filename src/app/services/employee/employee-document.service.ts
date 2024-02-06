import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeDocument } from "src/app/models/employeeDocument.interface";
import { HttpClient } from '@angular/common/http';
import { API } from '../../models/constants/urls.constants';

@Injectable({
    providedIn: 'root'
})

export class EmployeeDocumentService {
    constructor(private httpClient: HttpClient) { }

    getAllEmployeeDocuments(employeeId: number): Observable<EmployeeDocument[]> {
        return this.httpClient.get<EmployeeDocument[]>(`${API.HttpsBaseURL}/employee-documents/${employeeId}`);
    }
    saveEmployeeDocument(employeeDocument: any): Observable<EmployeeDocument> {
        return this.httpClient.post<EmployeeDocument>(`${API.HttpsBaseURL}/employee-documents`, employeeDocument);
    }
    getEmployeeDocument(employeeId: number, filename: string): Observable<EmployeeDocument> {
        return this.httpClient.get<EmployeeDocument>(`${API.HttpsBaseURL}/employee-documents/${employeeId}/${filename}`);
    }
    updateEmployeeDocument(employeeDocument: EmployeeDocument): Observable<EmployeeDocument> {
        return this.httpClient.put<EmployeeDocument>(`${API.HttpsBaseURL}/employee-documents/`, employeeDocument);
    }
    deleteEmployeeDocument(employeeDocument: EmployeeDocument): Observable<void> {
        return this.httpClient.delete<void>(`${API.HttpsBaseURL}/employee-documents/${employeeDocument.id}`);
    }
    getEmployeeDocumentsByStatus(employeeId: number, status: number): Observable<EmployeeDocument[]> {
        return this.httpClient.get<EmployeeDocument[]>(`${API.HttpsBaseURL}/employee-documents/${employeeId}/${status}`)
    }
};
