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

    getWorkExperience(id: number | undefined): Observable<WorkExperience[]> {
        return this.httpClient.get<WorkExperience[]>(`${this.baseUrl}?id=${id}`)
      }

    save(experience: WorkExperience): Observable<WorkExperience> {
        return this.httpClient.post<WorkExperience>(`${this.baseUrl}`, experience);
    }

    update(experience: WorkExperience): Observable<WorkExperience> {
        return this.httpClient.put<WorkExperience>(`${this.baseUrl}`, experience);
    }

    delete(experienceId: number): Observable<WorkExperience> {
        return this.httpClient.delete<WorkExperience>(`${this.baseUrl}/${experienceId}`);
    }
}
