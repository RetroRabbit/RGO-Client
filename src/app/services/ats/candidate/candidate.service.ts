import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';
import { Observable } from 'rxjs';
import { candidateDocument } from 'src/app/models/ats/candidateDocument.interface';

@Injectable({
  providedIn: 'root'
})

export class CandidateService {
  baseUrl: string;

  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) {
    this.baseUrl = `${environment.HttpsBaseURL}/candidates`
  }

  saveCandidateDocument(candidateDocument: any): Observable<candidateDocument> {
    return this.httpClient.post<candidateDocument>(`${this.baseUrl}`, candidateDocument);
  }
};