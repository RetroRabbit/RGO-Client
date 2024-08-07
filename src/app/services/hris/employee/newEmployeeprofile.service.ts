import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';
import { EmployeeProfileDetails } from 'src/app/models/hris/EmployeeProfile/employeeProfileDetails.interface';
import { employeeProfileBanking } from 'src/app/models/hris/EmployeeProfile/employeeProfileBankingInformation.interface';
import { EmployeeCareerSummary } from 'src/app/models/hris/EmployeeProfile/employeeCareerSummary.interface';

@Injectable({
    providedIn: 'root'
})
export class NewEmployeeProfileService {
    baseUrl: string;

    constructor(private httpClient: HttpClient,
        private authAccessService: AuthAccessService) {
        this.baseUrl = `${environment.HttpsBaseURL}/employee-profile`
    }

    getEmployeeProfileDetailsById(id: number): Observable<EmployeeProfileDetails> {
        const queryParams = `?id=${id}`;
        return this.httpClient.get<EmployeeProfileDetails>(`${this.baseUrl}/profile-details${queryParams}`);
    }

    getBankingInformationById(id: number): Observable<employeeProfileBanking> {
        const queryParams = `?id=${id}`;
        return this.httpClient.get<employeeProfileBanking>(`${this.baseUrl}/banking-information${queryParams}`);
    }

    getEmployeeCareerSummaryById(id: number): Observable<EmployeeCareerSummary> {
        const queryParams = `?id=${id}`;
        return this.httpClient.get<EmployeeCareerSummary>(`${this.baseUrl}/career-summary${queryParams}`);
    }
}
