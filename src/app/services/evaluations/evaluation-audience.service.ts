import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluationInput } from '../../models/evaluation-input.interface';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { environment } from '../../../environments/environment';
=======
import { environment } from '../../../enviroment/environment';
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c

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
