import { Injectable } from "@angular/core"

import { HttpClient } from "@angular/common/http"
import { environment } from "../../../environments/environment"
import { Observable } from "rxjs"
import { PropertyAccess } from "src/app/models/hris/properties.interface";

@Injectable({
  providedIn: 'root'
})

export class AccessPropertiesService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = `${environment.HttpsBaseURL}/access`
  }

  GetAccessProperties(employeeId: number): Observable<PropertyAccess[]> {
    return this.httpClient.get<PropertyAccess[]>(`${this.baseUrl}/role-access?employeeId=${employeeId}`);
  }

  GetAllAccessProperties(): Observable<PropertyAccess[]> {
    return this.httpClient.get<PropertyAccess[]>(`${this.baseUrl}/all`);
  }

  UpdateProperties(propertyId: number, propertyAccessId: number): any {
    return this.httpClient.put<any>(`${this.baseUrl}?propertyId=${propertyId}`, propertyAccessId);
  }

  SeedProperties(): any {
    return this.httpClient.get<any>(`${this.baseUrl}/seed-properties`);
  }

  FetchUserId(employeeEmail: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/user-id?email=${encodeURIComponent(employeeEmail ?? "")}`)
  }
}