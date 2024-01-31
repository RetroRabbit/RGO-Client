import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HideNavService {
  public showNavbar: boolean = false;
  public showSystemNavbar: boolean = true;
  public unsavedChanges: boolean = false;
}
