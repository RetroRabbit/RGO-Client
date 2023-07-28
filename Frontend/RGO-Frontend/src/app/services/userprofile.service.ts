import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Events } from '../models/events.interface';
import { API } from '../models/constants/urls.constants';
import { UserProfile } from '../models/userprofile.interface';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  constructor(private client: HttpClient) { }

  GetUserProfile(email: string ,token : any): Observable<UserProfile>{
    let header: HttpHeaders = new HttpHeaders()
    header = header.append('Authorization',`Bearer ${token}`)
    console.log(token);
    header = header.append('Content-Type','application/json')
    let params = new HttpParams()
    params.set("Email", email);

    return this.client.get<any>(`${API.HttpsBaseURL}/Profile/getuser`, {headers : header,params: params});
  }
}
