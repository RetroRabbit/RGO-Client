import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateItemService {

  constructor(private httpClient: HttpClient) { }

  getAll(template: string) {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluationtemplateitem/getall?template=${encodeURIComponent(template)}`)
  }
}
