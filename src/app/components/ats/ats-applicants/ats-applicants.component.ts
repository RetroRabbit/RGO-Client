import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-ats-applicants',
  templateUrl: './ats-applicants.component.html',
  styleUrls: ['./ats-applicants.component.css']
})
export class AtsApplicantsComponent {
  
  constructor(private fb: FormBuilder,
    private navService: NavService
  ) {
    navService.showNavbar = true;
    navService.isHris = false;
  }
}
