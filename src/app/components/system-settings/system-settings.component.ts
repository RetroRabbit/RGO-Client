import { Component, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FieldCode } from 'src/app/models/field-code.interface';
import { HideNavService } from 'src/app/services/hide-nav.service';
@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent {
  // @Output() RoleManagementEvent = new EventEmitter<void>();
  // @Output() CustomFieldsEvent = new EventEmitter<void>();
  @Output() emitFieldCode = new EventEmitter<FieldCode>();
  clicked: string = "";

  constructor(public cookieService: CookieService, public hideNavService: HideNavService) {

  }

  displayRoleManagement(): void {
    this.clicked = "Role Management";
    this.cookieService.set('currentPage', 'Role Management');
  }

  displayCustomFieldsManagement(): void {
    this.clicked = "Custom Field management";
    this.cookieService.set('currentPage', 'Custom Field management');
  }

  displayEmployeeBanking() {
    this.cookieService.set('currentPage', 'Employee Banking');
  }

  captureFieldCode(event: FieldCode){
    this.emitFieldCode.emit(event);
  }
}
