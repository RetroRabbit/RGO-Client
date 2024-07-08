import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeProfile } from '../../../models/hris/employee-profile.interface';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';
import { ChurnRateDataCard } from 'src/app/models/hris/churn-rate-data-card.interface';
import { EmployeeCountDataCard } from 'src/app/models/hris/employee-count-data-card.interface';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string;

  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) {
    this.baseUrl = `${environment.HttpsBaseURL}/dashboard`
  }
  /**
 * @summary  Checks for duplicate id number
 *
 */
  getTotalEmployees(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
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
}
