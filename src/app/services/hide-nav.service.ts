import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HideNavService {

  public showNavbar: boolean = true;

  constructor() { }
}
