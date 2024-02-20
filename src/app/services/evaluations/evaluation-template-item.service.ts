import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateItemService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/template-item`
  }
  getAll(template: string | null = null): Observable<any[]> {
    if (template!== null)
      return this.httpClient.get<any[]>(`${this.baseUrl}?template=${encodeURIComponent(template)}`)

    return this.httpClient.get<any[]>(`${this.baseUrl}`)
  }
  
  save(template: string, section: string, question: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}?template=${encodeURIComponent(template)}&section=${encodeURIComponent(section)}&question=${encodeURIComponent(question)}`, { })
  }

  delete(template: string, section: string, question: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}?template=${encodeURIComponent(template)}&section=${encodeURIComponent(section)}&question=${encodeURIComponent(question)}`)
  }
}
