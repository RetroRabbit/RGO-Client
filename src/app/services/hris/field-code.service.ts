import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomField } from '../../models/hris/custom-field.interface';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CustomFieldService {
    baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${environment.HttpsBaseURL}/field-code`
    }

    getAllFieldCodes(): Observable<CustomField[]> {
        return this.httpClient.get<CustomField[]>(`${this.baseUrl}`);
    }

    saveFieldCode(fieldCode:CustomField): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}`, fieldCode);
    }

    updateFieldCode(fieldCodeData: CustomField): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}`, fieldCodeData
        );
    }

    deleteFieldCode(fieldCodeData: CustomField): Observable<any> {
        return this.httpClient.delete<any>(`${this.baseUrl}`, {
            body: fieldCodeData,
        });
    }
}
