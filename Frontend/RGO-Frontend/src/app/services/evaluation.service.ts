import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { EvaluationInput } from '../models/evaluation-input.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private httpClient: HttpClient) { }

  getAll(email: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluation/getall?email=${encodeURIComponent(email)}`)
  }

  get(employeeEmail: string, ownerEmail: string, template: string, subject: string): Observable<any> {
    return this.httpClient.get<any>(`${API.HttpBaseURL}/employeeevaluation/get?employeeEmail=${encodeURIComponent(employeeEmail)}&ownerEmail=${encodeURIComponent(ownerEmail)}&template=${encodeURIComponent(template)}&subject=${encodeURIComponent(subject)}`)
  }

  save(evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/employeeevaluation/save`, evaluationInput)
  }

  delete(evaluationInput: EvaluationInput): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/employeeevaluation/delete`, { body: evaluationInput })
  }

  update(evaluationInputs: EvaluationInput[]): Observable<any> {
    return this.httpClient.put<any>(`${API.HttpBaseURL}/employeeevaluation/update`, evaluationInputs)
  }
}
