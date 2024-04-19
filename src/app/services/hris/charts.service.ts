import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChartData } from '../../models/hris/charts.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/charts`
  }

  getAllCharts(): Observable<ChartData[]> {
    return this.httpClient.get<ChartData[]>(`${this.baseUrl}`);
  }

  createChart(dataType: string[], roles: string[], chartName: string, chartType: string): Observable<any> {
    const queryParams = `?dataType=${dataType}&roles=${roles}&chartName=${chartName}&chartType=${chartType}`;
    return this.httpClient.post(`${this.baseUrl}${queryParams}`, {});
  }

  getChartDataByType(dataType: string[]): Observable<any> {

    const dataTypeString = dataType.join(',');

    const queryParams = `?dataTypes=${dataTypeString}`;

    return this.httpClient.get<any>(`${this.baseUrl}/data/${queryParams}`);
  }

  updateChart(dataType: ChartData): Observable<ChartData> {
    return this.httpClient.put<ChartData>(`${this.baseUrl}`, dataType);
  }

  deleteChart(chartId: number): Observable<any> {
    const queryParams = `?chartId=${chartId}`;
    return this.httpClient.delete<any>(`${this.baseUrl}${queryParams}`);
  }

  getEmployeeTableColumns(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/column`);
  }

  downloadCSV(dataTypes: string[]): Observable<ArrayBuffer> {
    const queryParams = `?dataTypes=${dataTypes}`;
    return this.httpClient.get(`${this.baseUrl}/report/export${queryParams}`, {
      responseType: 'arraybuffer'
    });
  }

}
