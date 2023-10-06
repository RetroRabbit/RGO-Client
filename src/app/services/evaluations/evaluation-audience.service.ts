import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluationInput } from '../../models/evaluation-input.interface';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EvaluationAudienceService {
  constructor(private httpClient: HttpClient) { }

  getAll(evaluationInput: EvaluationInput): Observable<any[]> {
    return this.httpClient.post<any[]>(`${API.HttpBaseURL}/evaluationaudience/getall`, evaluationInput)
  }

  save(email: string, evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/evaluationaudience/save?email=${encodeURIComponent(email)}`, evaluationInput)
  }

  delete(email: string, evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/evaluationaudience/delete?email=${encodeURIComponent(email)}`, { body: evaluationInput })
  }
}
