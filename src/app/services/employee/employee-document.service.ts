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
        return this.httpClient.get<EmployeeDocument[]>(`${API.HttpsBaseURL}/employeedocument/all/?employeeId= ${employeeId}`);
    }
    saveEmployeeDocument(employeeDocument: any): Observable<EmployeeDocument> {
        return this.httpClient.post<EmployeeDocument>(`${API.HttpsBaseURL}/employeedocument/save`, employeeDocument);
    }
    getEmployeeDocument(employeeId: number, filename: string): Observable<EmployeeDocument> {
        return this.httpClient.get<EmployeeDocument>(`${API.HttpsBaseURL}/employeedocument/get/${employeeId}/${filename}`);
    }
    updateEmployeeDocument(employeeDocument: EmployeeDocument): Observable<EmployeeDocument> {
        return this.httpClient.put<EmployeeDocument>(`${API.HttpsBaseURL}/employeedocument/update`, employeeDocument);
    }
    deleteEmployeeDocument(employeeDocument: EmployeeDocument): Observable<void> {
        return this.httpClient.delete<void>(`${API.HttpsBaseURL}/employeedocument/delete/${employeeDocument.id}`);
    }
};
