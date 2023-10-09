import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../models/constants/urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateItemService {

  constructor(private httpClient: HttpClient) { }

  getAll(template: string | null = null): Observable<any[]> {
    if (template!== null)
      return this.httpClient.get<any[]>(`${API.HttpBaseURL}/templateitem/getall?template=${encodeURIComponent(template)}`)

    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/templateitem/getall`)
  }
  
  save(template: string, section: string, question: string): Observable<any> {
    return this.httpClient.post<any>(`${API.HttpBaseURL}/templateitem/save?template=${encodeURIComponent(template)}&section=${encodeURIComponent(section)}&question=${encodeURIComponent(question)}`, { })
  }

  delete(template: string, section: string, question: string): Observable<any> {
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/templateitem/delete?template=${encodeURIComponent(template)}&section=${encodeURIComponent(section)}&question=${encodeURIComponent(question)}`)
  }
}
