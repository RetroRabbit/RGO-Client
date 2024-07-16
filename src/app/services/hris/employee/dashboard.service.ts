import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChurnRateDataCard } from 'src/app/models/hris/churn-rate-data-card.interface';
import { EmployeeCountDataCard } from 'src/app/models/hris/employee-count-data-card.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string;

  constructor(private httpClient: HttpClient,) {
    this.baseUrl = `${environment.HttpsBaseURL}/dashboard`
  }
 /**
 * @summary  get growthrate calculation answer from backend
 *
 */
  getGrowthrate(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/growth-rate`);
  }
  /**
 * @summary Gets churnrate info
 *
 */
  getChurnRate(): Observable<ChurnRateDataCard> {
    return this.httpClient.get<ChurnRateDataCard>(`${this.baseUrl}/churn-rate`);
  }
  /**
 * @summary gets count of datacards
 *
 */
  getEmployeeCountData(): Observable<EmployeeCountDataCard> {
    return this.httpClient.get<EmployeeCountDataCard>(`${this.baseUrl}/card-count`);
  }

  getActiveEmployeeCount(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count-active`)
  }
}
