import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CandidateDocument } from 'src/app/models/ats/candidateDocument.interface';

@Injectable({
  providedIn: 'root'
})

export class CandidateDocumentService {
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/candidates`
  }

  saveCandidateDocument(candidateDocument: CandidateDocument): Observable<CandidateDocument> {
    return this.httpClient.post<CandidateDocument>(`${this.baseUrl}`, candidateDocument);
  }
  getEmployeeDocument(candidateId: number, filename: string): Observable<CandidateDocument> {
        return this.httpClient.get<CandidateDocument>(`${this.baseUrl}?candidateId=${candidateId}?filename=${filename}`);
    }
};