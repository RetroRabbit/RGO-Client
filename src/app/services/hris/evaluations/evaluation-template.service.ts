import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/evaluation-template`
  }

  save(template:string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}?template=${template}`, {})
  }

  delete(template:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}?template=${template}`)
  }

  getAll() {
    return this.httpClient.get<any[]>(`${this.baseUrl}/all`)
  }
}
