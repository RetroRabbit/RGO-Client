import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { EvaluationRatingInput } from '../models/evaluation-rating-input.interface';
import { EvaluationInput } from '../models/evaluation-input.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEvaluationsRatingService {

  constructor(private httpClient: HttpClient) { }

  getall(evaluation: EvaluationInput): Observable<any[]> {
    return this.httpClient.post<any[]>(`${API.HttpBaseURL}/evaluationrating/getall`, evaluation)
  }

  save(evaluationRating: EvaluationRatingInput): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/evaluationrating/save`, evaluationRating)
  }

  update(evaluationRating: EvaluationRatingInput): Observable<any> {
    return this.httpClient.put<any>(`${API.HttpBaseURL}/evaluationrating/update`, evaluationRating)
  }

  delete(evaluationRating: EvaluationRatingInput): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/evaluationrating/delete`, { body: evaluationRating })
  }
}
