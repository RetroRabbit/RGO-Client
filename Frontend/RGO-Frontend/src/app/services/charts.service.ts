import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chart } from '../models/charts.interface';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(private httpClient: HttpClient) {}

  getAllCharts(): Observable<Chart[]> {
    return this.httpClient.get<Chart[]>(`${API.HttpBaseURL}/chart/get`);
  }

  createChart(dataType: string, chartName: string, chartType: string): Observable<any> {
    const queryParams = `?dataType=${dataType}&chartName=${chartName}&chartType=${chartType}`;
    return this.httpClient.post(`${API.HttpBaseURL}/chart/create${queryParams}`, {});
  }

  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${API.HttpBaseURL}/chart/employees/total`);
  }

  getChartDataByType(dataType: string): Observable<any> {
    return this.httpClient.get<any>(`${API.HttpBaseURL}/chart/getByType/${dataType}`);
  }
}



