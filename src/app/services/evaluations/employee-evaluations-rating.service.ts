import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { environment } from '../../../environments/environment';
=======
import { environment } from '../../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c
import { EvaluationRatingInput } from '../../models/evaluation-rating-input.interface';
import { EvaluationInput } from '../../models/evaluation-input.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeEvaluationsRatingService {

  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/evaluation-rating`
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
