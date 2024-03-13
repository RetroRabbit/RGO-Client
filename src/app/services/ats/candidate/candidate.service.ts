import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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