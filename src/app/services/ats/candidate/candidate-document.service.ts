import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthAccessService } from '../../shared-services/auth-access/auth-access.service';
import { Observable } from 'rxjs';
import { CandidateDocument } from 'src/app/models/ats/candidateDocument.interface';

@Injectable({
  providedIn: 'root'
})

export class CandidateService {
  baseUrl: string;

  constructor(private httpClient: HttpClient,
    private authAccessService: AuthAccessService) {
    this.baseUrl = `${environment.HttpsBaseURL}/candidates`
  }

  saveCandidateDocument(candidateDocument: CandidateDocument): Observable<CandidateDocument> {
    return this.httpClient.post<CandidateDocument>(`${this.baseUrl}`, candidateDocument);
  }
};