import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-ats-settings',
  templateUrl: './ats-settings.component.html',
  styleUrls: ['./ats-settings.component.css']
})
export class AtsSettingsComponent {
  constructor(private fb: FormBuilder,
    private navService: NavService
  ) {
    navService.showNavbar = true;
    navService.isHris = false;
  }
}
