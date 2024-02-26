import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldCode } from '../models/field-code.interface';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
=======
import { environment } from '../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c

@Injectable({
    providedIn: 'root',
})
export class FieldCodeService {
    baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${environment.HttpsBaseURL}/field-code`
    }

    getAllFieldCodes(): Observable<FieldCode[]> {
        return this.httpClient.get<FieldCode[]>(`${this.baseUrl}`);
    }

    saveFieldCode(fieldCodeDto:FieldCode): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}`, fieldCodeDto);
    }

    updateFieldCode(fieldCodeData: FieldCode): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}`, fieldCodeData
        );
    }

    deleteFieldCode(fieldCodeData: FieldCode): Observable<any> {
        return this.httpClient.delete<any>(`${this.baseUrl}`, {
            body: fieldCodeData,
        });
    }
}
