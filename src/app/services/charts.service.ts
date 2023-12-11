import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chart } from '../models/charts.interface';
import { API } from '../models/constants/urls.constants';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(private httpClient: HttpClient) { }

  getAllCharts(): Observable<Chart[]> {
    return this.httpClient.get<Chart[]>(`${API.HttpBaseURL}/chart/get`);
  }


  createChart(dataType: string[], roles: string[] ,chartName: string, chartType: string): Observable<any> {
    const queryParams = `?dataType=${dataType}&roles=${roles}&chartName=${chartName}&chartType=${chartType}`;
    return this.httpClient.post(`${API.HttpBaseURL}/chart/create${queryParams}`, {});
  }

  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${API.HttpBaseURL}/chart/employees/total`);
  }

  getChartDataByType(dataType: string[]): Observable<any> {

    const dataTypeString = dataType.join(',');

    const queryParams = `?dataTypes=${dataTypeString}`;

    return this.httpClient.get<any>(`${API.HttpBaseURL}/chart/data/${queryParams}`);
  }


  updateChart(dataType: Chart): Observable<Chart> {
    return this.httpClient.put<Chart>(`${API.HttpBaseURL}/chart/update`, dataType);
  }

  deleteChart(chartId: number): Observable<any> {
    const queryParams = `?Id=${chartId}`;
    return this.httpClient.delete<any>(`${API.HttpBaseURL}/chart/delete${queryParams}`);
  }

  getColumns(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API.HttpBaseURL}/chart/column`);
  }

  downloadCSV(dataTypes: string[]): Observable<ArrayBuffer> {
    const queryParams = `?dataTypes=${dataTypes}`;
    return this.httpClient.get(`${API.HttpBaseURL}/chart/report/export${queryParams}`, {
      responseType: 'arraybuffer'
    });
  }

}
