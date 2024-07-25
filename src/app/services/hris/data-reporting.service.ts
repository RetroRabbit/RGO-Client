import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DataReport } from "src/app/models/hris/data-report.interface";
import { environment } from "src/environments/environment";
import { NavItem } from "src/app/models/hris/report-menu-item.interface";
import { ReportColumnRequest } from "src/app/models/hris/report-column-request.interface";
import { AccessAvailability } from "src/app/models/hris/data-report-access-availability.interface";
import { ReportAccessRequest } from "src/app/models/hris/data-report-access-request.interface";
import { DataReportList } from "src/app/models/hris/data-report-list";


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

    archiveColumnOnReport(columnId: number): Observable<any> {
        return this.httpClient.delete<any>(`${this.baseUrl}/ui/archive-column-from-report?columnId=${columnId}`)
    }

    addOrUpdateReport(input: any): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/update-report`, input)
    }

    getReportAccess(reportId: number): Observable<AccessAvailability> {
        return this.httpClient.get<AccessAvailability>(`${this.baseUrl}/get-report-access-availability?reportId=${reportId}`)
    }

    updateReportAccess(input: ReportAccessRequest): Observable<ReportAccessRequest> {
        return this.httpClient.put<ReportAccessRequest>(`${this.baseUrl}/update-report-access`, input)
    }

    archiveReportAccess(accessId: number): Observable<any> {
        return this.httpClient.delete<any>(`${this.baseUrl}/archive-report-access?accessId=${accessId}`)
    }

    fetchDataReportList(): Observable<DataReportList[]> {
        return this.httpClient.get<DataReportList[]>(`${this.baseUrl}/get-data-report-list`);
    }

    deleteDataReport(code: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.baseUrl}/delete-report?code=${code}`)
    }

    addOrUpdateReportFilter(input: any): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/update-data-report-filter`, input)
    }

    deleteDataReportFilter(id : number): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/archive-data-report-filter`, id)
    }

    fetchReportDataFilter(reportcode: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseUrl}/get-data-report-filter?code=${reportcode}`);
    }
    
}