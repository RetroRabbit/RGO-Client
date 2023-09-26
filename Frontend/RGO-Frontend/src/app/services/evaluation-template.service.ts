import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EvaluationTemplateService {

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<any[]>(`${API.HttpBaseURL}/evaluationtemplate/getall`)
  }
}
