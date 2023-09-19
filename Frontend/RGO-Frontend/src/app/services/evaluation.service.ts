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

  get(): Observable<Evaluation[]> {
    return this.httpClient.get<Evaluation[]>(`${API.HttpBaseURL}/employeeevaluation/get`)
  }

  save(evaluation: any): Observable<Evaluation> {
    return this.httpClient.post<Evaluation>(`${API.HttpBaseURL}/employeeevaluation/save`, evaluation)
  }

  delete(evaluation: Evaluation): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/employeeevaluation/delete`, { body: evaluation})
  }
}
