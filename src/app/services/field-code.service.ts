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
        return this.httpClient.get<FieldCode[]>(`${API.HttpsBaseURL}/fieldcode/get`);
    }

    saveFieldCode(fieldCodeDto:FieldCode): Observable<any> {
        return this.httpClient.post<any>(`${API.HttpsBaseURL}/fieldcode/save`, fieldCodeDto);
    }

    updateFieldCode(fieldCodeData: FieldCode): Observable<any> {
        return this.httpClient.put<any>(`${API.HttpsBaseURL}/fieldcode/update`, fieldCodeData
        );
    }

    deleteFieldCode(fieldCodeData: FieldCode): Observable<any> {
        return this.httpClient.delete<any>(`${API.HttpsBaseURL}/fieldcode/delete`, {
            body: fieldCodeData,
        });
    }
}
