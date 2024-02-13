import { Injectable } from "@angular/core"
import { Properties } from "../models/properties.interface"
import { HttpClient } from "@angular/common/http"
import { API } from "../models/constants/urls.constants"
import { Observable } from "rxjs"

@Injectable({
    providedIn: 'root'
  })

export class AccessPropertiesService{
    
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${API.HttpsBaseURL}/access`
  }
    GetAccessProperties(email : string) : Observable<Properties[]>{
      return this.httpClient.get<Properties[]> (
        `${this.baseUrl}?email=${email}`
      );
    }

    UpdateProperties(email : string, payload : any): any{
        return this.httpClient.put<any>(
            `${this.baseUrl}?email=${email}`, payload
        );
    }
}