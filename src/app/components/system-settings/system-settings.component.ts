import { Component, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FieldCode } from 'src/app/models/field-code.interface';
import { HideNavService } from 'src/app/services/hide-nav.service';
import { SystemNav } from 'src/app/services/system-nav.service';
@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent {
  @Output() emitFieldCode = new EventEmitter<FieldCode>();
  clicked: string = "";

  constructor(public cookieService: CookieService, public hideNavService: HideNavService, public systemNavItemService: SystemNav) {
    hideNavService.showNavbar = true;
  }

  displayRoleManagement(): void {
    this.systemNavItemService.selectedMenuItem = "Role Management";
  }

  displayCustomFieldsManagement(): void {
    this.systemNavItemService.selectedMenuItem = "Custom Field management";
  }

  displayEmployeeBanking() {
    this.cookieService.set('currentPage', 'Employee Banking');
  }

  captureFieldCode(event: FieldCode){
    this.emitFieldCode.emit(event);
  }
}
