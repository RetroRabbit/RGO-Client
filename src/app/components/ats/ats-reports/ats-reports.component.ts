import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-ats-reports',
  templateUrl: './ats-reports.component.html',
  styleUrls: ['./ats-reports.component.css']
})
export class AtsReportsComponent {
  constructor(private fb: FormBuilder,
    private navService: NavService
  ) {
    navService.showNavbar = true;
    navService.isHris = false;
  }
}
