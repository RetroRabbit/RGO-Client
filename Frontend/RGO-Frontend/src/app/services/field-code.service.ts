import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldCode } from '../models/field-code.interface';
import { FieldCodeOptions } from '../models/field-code-options.interface';
import { API } from '../models/constants/urls.constants';

@Injectable({
    providedIn: 'root'
  })
  export class FieldCodeService {
  
    constructor(private httpClient: HttpClient) { }
  
    getAllFieldCodes(): Observable<FieldCode[]>{
      return this.httpClient.get<FieldCode[]>(`${API.HttpBaseURL}/field-code/options/get`);
    }
  
    addFieldCode(newFieldCode: any): Observable<any>{
      return this.httpClient.post<any>(`${API.HttpBaseURL}/field-code/add`, newFieldCode);
    }

    addFieldCodeOptions(option: FieldCodeOptions): Observable<any> {
      return this.httpClient.post<any>(`${API.HttpBaseURL}/field-code/options/add`, option);
    }

    // TODO: addFieldCodeOptions, deleteFieldCodeOption, edutFieldCodeOptions etc..
  }
  