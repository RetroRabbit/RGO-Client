import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Candidate } from 'src/app/models/ats/candidate.interface';

@Injectable({
  providedIn: 'root'
})

export class CandidateService {
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/candidates`
  }

  saveCandidate(newcandidate: Candidate): Observable<Candidate> {
    return this.httpClient.post<Candidate>(`${this.baseUrl}`, newcandidate);
  }
  getEmployeeDocument(candidateId: number, filename: string): Observable<Candidate> {
        return this.httpClient.get<Candidate>(`${this.baseUrl}?candidateId=${candidateId}?filename=${filename}`);
    }
};