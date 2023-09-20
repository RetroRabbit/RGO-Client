import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../models/constants/urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateItemService {

  constructor(private httpClient: HttpClient) { }

  getAll(template: string | null = null): Observable<any[]> {
    return template !== null
    ? this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluationitem/getall?template=${encodeURIComponent(template)}`)
    : this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluationitem/getall`)
  }
  
}
