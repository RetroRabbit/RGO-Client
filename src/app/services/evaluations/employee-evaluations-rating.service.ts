import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../models/constants/urls.constants';
import { EvaluationRatingInput } from '../../models/evaluation-rating-input.interface';
import { EvaluationInput } from '../../models/evaluation-input.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEvaluationsRatingService {

  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${API.HttpsBaseURL}/evaluation-rating`
  }
  getall(evaluation: EvaluationInput): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/all`, evaluation)
  }

  save(evaluationRating: EvaluationRatingInput): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, evaluationRating)
  }

  update(evaluationRating: EvaluationRatingInput): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}`, evaluationRating)
  }

  delete(evaluationRating: EvaluationRatingInput): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}`, { body: evaluationRating })
  }
}
