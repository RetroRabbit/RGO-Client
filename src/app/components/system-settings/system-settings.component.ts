import { Component, Output,
  EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent {
  @Output() RoleManagementEvent = new EventEmitter<void>();
  @Output() CustomFieldsEvent = new EventEmitter<void>();

  

  constructor (public cookieService: CookieService){

  }

  ngOnInit() {
  }

  displayRoleManagement(): void {
    this.cookieService.set('currentPage', 'Role Management');
  }

  displayCustomFieldsManagement(): void {
    this.cookieService.set('currentPage', 'Custom Field management');
  }

  displayEmployeeBanking() {
    this.cookieService.set('currentPage', 'Employee Banking');
  }
}
