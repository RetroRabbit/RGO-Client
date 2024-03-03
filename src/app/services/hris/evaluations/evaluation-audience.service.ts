import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluationInput } from '../../../models/hris/evaluation-input.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationAudienceService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/evaluation-audience`
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
