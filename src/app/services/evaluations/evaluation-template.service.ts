import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../models/constants/urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateService {

  constructor(private httpClient: HttpClient) { }

  save(template:string): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/evaluationtemplate/save?template=${template}`, {})
  }

  delete(template:string): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/evaluationtemplate/delete?template=${template}`)
  }

  getAll() {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/evaluationtemplate/getall`)
  }
}
