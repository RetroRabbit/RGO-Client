import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any[]> {
    return of([
      {
        owner: 'jdoe@retrorabbit.co.za',
        subject: 'tsubject@retrorabbit.co.za',
        description: 'This is a description',
        rating: 50,
        comments: 'This is a comment',
      }
    ])
  }

  get(email: string): Observable<any> {
    return of({
      owner: '',
      subject: '',
      description: '',
      rating: 0,
      comments: '',
    })
  }
}
