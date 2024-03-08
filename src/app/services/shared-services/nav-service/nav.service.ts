import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public showNavbar: boolean = false;
  public showSystemNavbar: boolean = true;
  public unsavedChanges: boolean = false;
  public isHris?: boolean;
}
