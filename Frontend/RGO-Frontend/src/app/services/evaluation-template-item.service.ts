import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../models/constants/urls.constants';
import { TemplateItem } from '../models/templateItem.interface';
@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateItemService {

  constructor(private httpClient: HttpClient) { }

  getAllByTemplate(template: string) {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/employeeevaluationitem/getall?template=${template}`)
  }

  getAll() {
    return this.httpClient.get<TemplateItem[]>(`${API.HttpBaseURL}/employeeevaluationitem/getall`)
  }
}
