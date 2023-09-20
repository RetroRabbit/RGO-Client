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

  getAll(email: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluation/getall?email=${encodeURIComponent(email)}`)
  }

  get(employeeEmail: string, ownerEmail: string, template: string, subject: string): Observable<any> {
    return this.httpClient.get<any>(`${API.HttpBaseURL}/employeeevaluation/get?employeeEmail=${encodeURIComponent(employeeEmail)}&ownerEmail=${encodeURIComponent(ownerEmail)}&template=${encodeURIComponent(template)}&subject=${encodeURIComponent(subject)}`)
  }

  save(employeeEmail: string, ownerEmail: string, template: string, subject: string): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/employeeevaluation/save?employeeEmail=${encodeURIComponent(employeeEmail)}&ownerEmail=${encodeURIComponent(ownerEmail)}&template=${encodeURIComponent(template)}&subject=${encodeURIComponent(subject)}`, {})
  }

  delete(employeeEmail: string, ownerEmail: string, template: string, subject: string): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/employeeevaluation/delete?employeeEmail=${encodeURIComponent(employeeEmail)}&ownerEmail=${encodeURIComponent(ownerEmail)}&template=${encodeURIComponent(template)}&subject=${encodeURIComponent(subject)}`, {})
  }

  update(evaluation: any): Observable<any> {
    return this.httpClient.put<any>(`${API.HttpBaseURL}/employeeevaluation/update`, evaluation)
  }
}
