import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WorkExperience } from 'src/app/models/hris/work-experience.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService {

    baseUrl: string;
    
    constructor(private httpClient: HttpClient) { 
        this.baseUrl =`${environment.HttpsBaseURL}/work-experience`
    }

    getWorkExperience(id: number): Observable<WorkExperience[]> {
        return this.httpClient.get<WorkExperience[]>(`${this.baseUrl}?id=${id}`)
      }

    saveWorkExperience(experience: WorkExperience): Observable<WorkExperience> {
        return this.httpClient.post<WorkExperience>(`${this.baseUrl}`, experience);
    }

    updateWorkExperience(experience: WorkExperience): Observable<any> {
        return this.httpClient.put<WorkExperience[]>(`${this.baseUrl}`, experience);
    }

    deleteWorkExperience(experienceId: number): Observable<WorkExperience> {
        return this.httpClient.delete<WorkExperience>(`${this.baseUrl}?id=${experienceId}`);
    }
}
