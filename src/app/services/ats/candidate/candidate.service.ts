import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../../models/hris/employee.interface';
import { EmployeeProfile } from '../../../models/hris/employee-profile.interface';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';

@Injectable({
    providedIn: 'root'
  })

export class CandidateService {
    baseUrl: string;

  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) {
    this.baseUrl = `${environment.HttpsBaseURL}/candidates`
  }
}