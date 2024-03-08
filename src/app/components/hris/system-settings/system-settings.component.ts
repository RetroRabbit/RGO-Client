import { Component, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FieldCode } from 'src/app/models/hris/field-code.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent {
  @Output() emitFieldCode = new EventEmitter<FieldCode>();
  clicked: string = "";

  constructor(public cookieService: CookieService, public navService: NavService, public systemNavItemService: SystemNav) {
    navService.showNavbar = true;
  }

  displayRoleManagement(): void {
    this.systemNavItemService.selectedMenuItem = "Role Management";
  }

  displayCustomFieldsManagement(): void {
    this.systemNavItemService.selectedMenuItem = "Custom Field management";
  }

  displayEmployeeBanking() {
    this.systemNavItemService.selectedMenuItem = "Employee Banking";
  }

  displayPropertyAccessManagement() {
    this.systemNavItemService.selectedMenuItem = "Property Access Management";
  }

  captureFieldCode(event: FieldCode) {
    this.emitFieldCode.emit(event);
  }
}