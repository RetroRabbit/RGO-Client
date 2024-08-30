import { Component, Output, EventEmitter, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent {
  hideRoleManagement = true;
  clicked: string = "";
  screenWidth = window.innerWidth;

  @Output() emitFieldCode = new EventEmitter<CustomField>();

  constructor(public cookieService: CookieService,
    public navService: NavService,
    public systemNavItemService: SystemNav,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.systemNavItemService.selectedMenuItem = "Custom Field management";
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.ngZone.run(() => {
      this.screenWidth = window.innerWidth;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.onResize();
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

  captureFieldCode(event: CustomField) {
    this.emitFieldCode.emit(event);
  }
}
