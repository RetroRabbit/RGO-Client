import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private totalRequests = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  constructor() { }

  showSpinnerElement() {
    if (this.totalRequests === 0) {
      this.isLoadingSubject.next(true);
    }
    this.totalRequests++;
  }

  hideSpinnerElement() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this.isLoadingSubject.next(false);
    }
  }
}
