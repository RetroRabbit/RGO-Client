import { Injectable } from "@angular/core"
import { Properties } from "../models/properties.interface"
import { HttpClient } from "@angular/common/http"
<<<<<<< HEAD
import { environment } from "../../environments/environment"
=======
import { environment } from "../../enviroment/environment"
>>>>>>> b4b664c65a016479c675288e5b00e3785d0c808c
import { Observable } from "rxjs"

@Injectable({
    providedIn: 'root'
  })

export class AccessPropertiesService{
    
  baseUrl: string;
    
  constructor(private httpClient: HttpClient) { 
      this.baseUrl =`${environment.HttpsBaseURL}/access`
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