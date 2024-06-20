import { Component, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CustomField } from 'src/app/models/hris/custom-field.interface';
import { SystemNav } from 'src/app/services/hris/system-nav.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { EmployeeApprovalsComponent } from '../employee-approvals/employee-approvals.component';
import { EmpBankStarterService } from 'src/app/services/hris/employee/employee-bankingandstarterkit.service';
@Component({
  selector: 'app-employee-options',
  templateUrl: './employee-options.component.html',
  styleUrls: ['./employee-options.component.css']
})
export class EmployeeOptionsComponent {
  @Output() emitFieldCode = new EventEmitter<CustomField>();
  clicked: string = "";

  constructor(public cookieService: CookieService,
     public systemNavItemService: SystemNav,
     private authAccessService: AuthAccessService,
     public employeeApprovals : EmployeeApprovalsComponent,
     public empBankStarterService: EmpBankStarterService
    ) {
    if (!this.systemNavItemService.selectedEmployeeMenuItem) {
      this.systemNavItemService.selectedEmployeeMenuItem = "View Employees";
    }
  }

  ngOnInit() : void {
    this.employeeApprovals.fetchBankStarterKits();
  }

  hideSideMenuFromJourney(): boolean{
    return this.authAccessService.isJourney();
  }

  displayEmployees(): void {
    this.systemNavItemService.selectedEmployeeMenuItem = "View Employees";
  }

  displayEmployeeApprovals(): void {
    this.systemNavItemService.selectedEmployeeMenuItem = "Employee Approvals";
  }
  
  displayEmployeeBanking() {
    this.systemNavItemService.selectedEmployeeMenuItem = "Employee Banking";
  }

  captureFieldCode(event: CustomField){
    this.emitFieldCode.emit(event);
  }
}