import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../models/constants/urls.constants';
import { Workshop } from '../models/Workshop.interface';
import { Token } from '../models/token.interface';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  token: string = '';

  constructor(private client: HttpClient, private appStore : Store<{app : Token}>) { }

  getAllWorkshops(): Observable<Workshop[]>{
    return this.client.get<Workshop[]>(`${API.HttpsBaseURL}/workshop/workshops`);
  }

  public CaptureEvent(page: string, selectedItem: EventEmitter<{ selectedPage: string }>) {
    selectedItem.emit({
      selectedPage: page
    });
  }
}
