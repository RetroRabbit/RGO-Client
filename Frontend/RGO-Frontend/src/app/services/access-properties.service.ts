import { Injectable } from "@angular/core"
import { Properties } from "../models/properties.interface"
import { HttpClient } from "@angular/common/http"
import { API } from "../models/constants/urls.constants"
import { Observable } from "rxjs"

@Injectable({
    providedIn: 'root'
  })

export class AccessPropertiesService{
    
    constructor(private client : HttpClient ){}

    GetAccessProperties(email : string) : Observable<Properties[]>{
      return this.client.get<Properties[]> (
        `${API.HttpsBaseURL}/access/get?email=${email}`
      );
    }

    UpdateProperties(email : string, payload : any){
        return this.client.put<string>(
            `${API.HttpBaseURL}/access/update?email=${email}`, payload
        )
    }
}