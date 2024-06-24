import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DataReport } from "src/app/models/hris/data-report.interface";
import { environment } from "src/environments/environment";
import { NavItem } from "src/app/models/hris/report-menu-item.interface";
import { ReportColumnRequest } from "src/app/models/hris/report-column-request.interface";


@Injectable({
    providedIn: 'root'
})
export class DataReportingService {
    baseUrl: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = `${environment.HttpsBaseURL}/data-reports`
    }

    fetchReportData(reportCode: string): Observable<DataReport> {
        return this.httpClient.get<DataReport>(`${this.baseUrl}/get-data-report?code=${reportCode}`);
    }

    updateReportData(reportInput: any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/update-report-input`, reportInput)
    }

    fetchMenuItems(): Observable<NavItem[]> {
        return this.httpClient.get<NavItem[]>(`${this.baseUrl}/ui/get-column-menu`)
    }

    addColumnToReport(columnInput: ReportColumnRequest): Observable<ReportColumnRequest> {
        return this.httpClient.put<ReportColumnRequest>(`${this.baseUrl}/ui/add-column-to-report`, columnInput)
    }

    moveColumnOnReport(columnInput: ReportColumnRequest): Observable<ReportColumnRequest> {
        return this.httpClient.put<ReportColumnRequest>(`${this.baseUrl}/ui/move-column-on-report`, columnInput)
    }

    addOrUpdateReport(input: any): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/update-report`, input)
    }
}