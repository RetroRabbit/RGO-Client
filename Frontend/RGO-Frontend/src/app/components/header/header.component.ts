import { Component, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  currentTime = new Date();
  sidebarVisible = false;
  navbar: HTMLElement = this.element.nativeElement;

  constructor(private auth: AuthService, private element: ElementRef) {}

  ngOnDestroy() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
  }

  Logout() {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
  
  sidebarToggle(){
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
        this.sidebarClose();
    }
  }

  sidebarOpen() {
    
    const toggleButton = this.navbar.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function(){
        toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    this.sidebarVisible = true;
  };

  sidebarClose() {
      const body = document.getElementsByTagName('body')[0];
      const toggleButton = this.navbar.getElementsByClassName('navbar-toggler')[0];
      toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
  };
}
