import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluationInput } from '../../models/evaluation-input.interface';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EvaluationAudienceService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${API.HttpsBaseURL}/evaluation-audience`
  }

  getAll(evaluationInput: EvaluationInput): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/all`, evaluationInput)
  }

  save(email: string, evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}?email=${encodeURIComponent(email)}`, evaluationInput)
  }

  delete(email: string, evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}?email=${encodeURIComponent(email)}`, { body: evaluationInput })
  }
}
