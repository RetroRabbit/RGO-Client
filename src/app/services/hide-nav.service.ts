import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HideNavService {

  private showNavElements = new BehaviorSubject<boolean>(true);

  public showNavElements$ = this.showNavElements.asObservable();

  constructor() { }

  public toggleNavElements(show: boolean): void {
    this.showNavElements.next(show);
  }
}
