import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';

@Component({
  selector: 'app-ats-dashboard',
  templateUrl: './ats-dashboard.component.html',
  styleUrls: ['./ats-dashboard.component.css']
})
export class AtsDashboardComponent {

  ngOnInit() {
    this.navService.isHris=false;
  }
  
  constructor(private fb: FormBuilder,
    private navService: NavService
  ) {
    navService.showNavbar = true;
    navService.isHris = false;
  }
}
