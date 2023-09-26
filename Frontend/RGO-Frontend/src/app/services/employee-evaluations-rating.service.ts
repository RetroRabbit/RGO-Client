import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEvaluationsRatingService {

  constructor(private httpClient: HttpClient) { }

  getall(evaluation: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${API.HttpBaseURL}/evaluationrating/getall`, evaluation)
  }
}
