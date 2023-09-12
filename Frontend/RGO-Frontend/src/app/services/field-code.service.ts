import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldCode } from '../models/field-code.interface';
import { API } from '../models/constants/urls.constants';

@Injectable({
    providedIn: 'root',
})
export class FieldCodeService {
    constructor(private httpClient: HttpClient) { }

    getAllFieldCodes(): Observable<FieldCode[]> {
        return this.httpClient.get<FieldCode[]>(`${API.HttpBaseURL}/fieldcode/get`);
    }

    saveFieldCode(fieldCodeData: any): Observable<any> {
        return this.httpClient.post<any>(`${API.HttpBaseURL}/fieldcode/save`, fieldCodeData);
    }

    updateFieldCode(fieldCodeData: FieldCode): Observable<any> {
        return this.httpClient.put<any>(`${API.HttpBaseURL}/fieldcode/update`, fieldCodeData
        );
    }

    deleteFieldCode(fieldCodeData: FieldCode): Observable<any> {
        return this.httpClient.delete<any>(`${API.HttpBaseURL}/fieldcode/delete`, {
            body: fieldCodeData,
        });
    }
}
