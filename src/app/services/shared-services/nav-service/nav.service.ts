import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public showNavbar: boolean = false;
  public showSideBar: boolean = false;
  public showSystemNavbar: boolean = true;
  public unsavedChanges: boolean = false;

  public expandSideNav: boolean = false;
  public showNavContainer: boolean = true;
  public showTopNavMenu: boolean = false;

  constructor(
  )
  { }


  public hideNav() {
    this.showNavContainer = false;
  }

  public showNav() {
    this.showNavContainer = true;
  }

  public toggleSideBar() {
    this.expandSideNav = !this.expandSideNav;
  }
}