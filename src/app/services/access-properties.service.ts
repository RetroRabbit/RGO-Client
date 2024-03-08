import { Injectable } from "@angular/core"
import { PropertyAccess } from "../models/properties.interface"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../enviroment/environment"
import { Observable } from "rxjs"

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
    return this.httpClient.get<any>(`${this.baseUrl}/seed-prop`);
  }
}