import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { Evaluation } from '../models/evaluation.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private httpClient: HttpClient) { }

  get(email: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluation/getall?email=${encodeURIComponent(email)}`)
  }

  save(evaluation: any): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/employeeevaluation/save`, evaluation)
  }

  delete(evaluation: any): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/employeeevaluation/delete`, { body: evaluation})
  }

  update(evaluation: any): Observable<any> {
    return this.httpClient.put<any>(`${API.HttpBaseURL}/employeeevaluation/update`, evaluation)
  }
}
