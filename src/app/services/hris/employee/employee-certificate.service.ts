import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EmployeeCertificates } from "src/app/models/hris/employee-certificates.interface";

@Injectable({
    providedIn: 'root'
  })

export class EmployeeCertificatesService{
  baseUrl: string;
  
    constructor(private httpClient : HttpClient){
      this.baseUrl =`${environment.HttpsBaseURL}/certification`
    }

    // getCertificates(status : number): Observable<EmployeeCertificates[]>{
    //     return this.httpClient.get<EmployeeCertificates[]>(`${this.baseUrl}?status=${status}`);
    // }

    updateCertification(updatedEntry : any) :Observable<any> {
        return this.httpClient.put<EmployeeCertificates[]>(`${this.baseUrl}`, updatedEntry);
    }

    getCertificationDetails(id: number | undefined): Observable<EmployeeCertificates[]> {
      return this.httpClient.get<EmployeeCertificates[]>(`${this.baseUrl}/details?id=${id}`)
    }

    saveCertitification(newEntry : EmployeeCertificates): Observable<EmployeeCertificates> {
    return this.httpClient.post<EmployeeCertificates>(`${this.baseUrl}`, newEntry);
    }
}