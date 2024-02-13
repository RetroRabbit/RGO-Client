import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API } from '../../models/constants/urls.constants';
import { EvaluationInput } from '../../models/evaluation-input.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${API.HttpsBaseURL}/evaluation`
  }

  getAll(email: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}?email=${encodeURIComponent(email)}`)
  }

  get(employeeEmail: string, ownerEmail: string, template: string, subject: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}?employeeEmail=${encodeURIComponent(employeeEmail)}&ownerEmail=${encodeURIComponent(ownerEmail)}&template=${encodeURIComponent(template)}&subject=${encodeURIComponent(subject)}`)
  }

  save(evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.post<any>(`$${this.baseUrl}`, evaluationInput)
  }

  delete(evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}`, { body: evaluationInput })
  }

  update(evaluationInputs: EvaluationInput[]): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}`, evaluationInputs)
  }
}
