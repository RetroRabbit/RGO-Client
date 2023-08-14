import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Userstacks } from '../models/userstacks.interface';
import { API } from '../models/constants/urls.constants';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Token } from '../models/token.interface';

@Injectable({
  providedIn: 'root'
})
export class UserstacksService {
  token: string = '';
  email: string = '';

  constructor(private client: HttpClient, private store: Store<{app: Token}> ) { }

  getUserstacks(): Observable<Userstacks>{
    this.getEmail();
    return this.client.get<Userstacks>(`${API.HttpsBaseURL}/userstacks/get?email=${encodeURIComponent(this.email)}`);
  }

  setUserstacks(): Observable<Userstacks>{
    this.getEmail()
    return this.client.post<Userstacks>(`${API.HttpsBaseURL}/userstacks/add?email=${encodeURIComponent(this.email)}`, {responseType: 'text'});
  }
  public CaptureEvent(page: string, selectedItem: EventEmitter<{ selectedPage: string }>) {
    selectedItem.emit({
      selectedPage: page
    });
  }
  getEmail(){
    this.store.select('app').subscribe( state => {
      this.email = state.email;
    })
  }
}
