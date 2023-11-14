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

  onRoleManagementClick(): void {
    this.RoleManagementEvent.emit();
    this.cookieService.set('currentPage', 'Role Management');
  }

  onCustomFieldsManagementClick(): void {
    this.RoleManagementEvent.emit();
    this.cookieService.set('currentPage', 'Custom Field management');
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.cookieService.set('currentPage', target.innerText);
  }
}
