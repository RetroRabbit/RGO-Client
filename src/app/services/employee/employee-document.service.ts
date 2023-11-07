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

    // Get all employee documents
    getAllEmployeeDocuments(employeeId: number): Observable<EmployeeDocument[]> {
        return this.httpClient.get<EmployeeDocument[]>(`${API.HttpsBaseURL}/employeedocument/getAll/${employeeId}`);
    }

    // Save an employee document
    saveEmployeeDocument(employeeDocument: EmployeeDocument): Observable<EmployeeDocument> {
        return this.httpClient.post<EmployeeDocument>(`${API.HttpsBaseURL}/employeedocument/save`, employeeDocument);
    }

    // Get an employee document by employee ID and filename
    getEmployeeDocument(employeeId: number, filename: string): Observable<EmployeeDocument> {
        return this.httpClient.get<EmployeeDocument>(`${API.HttpsBaseURL}/employeedocument/get/${employeeId}/${filename}`);
    }

    // Update an employee document
    updateEmployeeDocument(employeeDocument: EmployeeDocument): Observable<EmployeeDocument> {
        return this.httpClient.put<EmployeeDocument>(`${API.HttpsBaseURL}/employeedocument/update`, employeeDocument);
    }

    // Delete an employee document
    deleteEmployeeDocument(employeeDocument: EmployeeDocument): Observable<void> {
        return this.httpClient.delete<void>(`${API.HttpsBaseURL}/employeedocument/delete/${employeeDocument.id}`);
    }
};
