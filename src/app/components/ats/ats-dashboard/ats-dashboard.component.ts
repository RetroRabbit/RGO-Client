import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-ats-dashboard',
  templateUrl: './ats-dashboard.component.html',
  styleUrls: ['./ats-dashboard.component.css']
})
export class AtsDashboardComponent {
  
  constructor(private fb: FormBuilder,
    private navService: NavService
  ) {
    navService.showNavbar = true;
    navService.isHris = false;
  }
}
