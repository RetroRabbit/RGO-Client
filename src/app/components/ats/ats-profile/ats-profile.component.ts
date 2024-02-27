import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-ats-profile',
  templateUrl: './ats-profile.component.html',
  styleUrls: ['./ats-profile.component.css']
})
export class AtsProfileComponent {
  
  constructor(private fb: FormBuilder,
    private navService: NavService
  ) {
    navService.showNavbar = true;
    navService.isHris = false;
  }
}
