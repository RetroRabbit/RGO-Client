import { NgModule } from '@angular/core';
import { SignInComponent } from './components/hris/sign-in/sign-in.component';
import { ManageFieldCodeComponent } from './components/hris/custom-fields/manage-field-code/manage-field-code.component';
import { ChartComponent } from './components/hris/charts/charts.component';
import { CreateChartsComponent } from './components/hris/charts/create-charts/create-charts.component';
import { NewEmployeeComponent } from './components/hris/employees/new-employee/new-employee.component';
import { SaveCustomFieldComponent } from './components/hris/custom-fields/save-custom-field/save-custom-field.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsComponent } from './components/hris/employees/employee-details/employee-details.component';
import { ViewEmployeeComponent } from './components/hris/employees/view-employee/view-employee.component';
import { EmployeeProfileComponent } from './components/hris/employees/employee-profile/employee-profile.component';
import { SystemSettingsComponent } from './components/hris/system-settings/system-settings.component';
import { AdminDashboardComponent } from './components/hris/admin-dashboard/admin-dashboard.component';
import { AtsDashboardComponent } from './components/ats/ats-dashboard/ats-dashboard.component';
import { HrisPageGuard } from './hris-guard.guard';
import { AtsPageGuard } from './ats-guard.guard';
import { NewCandidateComponent } from './components/ats/candidates/new-candidate/new-candidate.component';
import { ViewStarterKitApprovalComponent } from './components/hris/employees/employee-approvals/view-starter-kit-approval/view-starter-kit-approval.component';
import { EmployeeOptionsComponent } from './components/hris/employees/employee-options/employee-options.component';
import { ViewBankingApprovalComponent } from './components/hris/employees/employee-approvals/view-banking-approval/view-banking-approval.component';
import { CareerSummaryQualificationsComponent } from './components/hris/employees/employee-profile/accordions/accordion-career-summary/accordion-career-summary-qualifications/accordion-career-summary-qualifications.component';
import { EmployeeTerminationComponent } from './components/hris/employees/employee-termination/employee-termination.component';
import { CvDocumentComponent } from './components/hris/cv-document/cv-document.component';
import { DataReportsComponent } from './components/hris/data-reports/index/data-reports.component';
import { DataReportDetailComponent } from './components/hris/data-reports/details/data-report-detail.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [HrisPageGuard] },
  { path: 'employees', component: EmployeeOptionsComponent, canActivate: [HrisPageGuard] },
  { path: 'profile', component: EmployeeProfileComponent, canActivate: [HrisPageGuard] },
  { path: 'profile/:id', component: EmployeeProfileComponent, canActivate: [HrisPageGuard] },
  { path: 'system-settings', component: SystemSettingsComponent, canActivate: [HrisPageGuard] },
  { path: 'manage-field', component: ManageFieldCodeComponent, canActivate: [HrisPageGuard] },
  { path: 'charts', component: ChartComponent, canActivate: [HrisPageGuard] },
  { path: 'create-charts', component: CreateChartsComponent, canActivate: [HrisPageGuard] },
  { path: 'create-employee', component: NewEmployeeComponent, canActivate: [HrisPageGuard] },
  { path: 'save-custom-field', component: SaveCustomFieldComponent, canActivate: [HrisPageGuard] },
  { path: 'employee-details', component: EmployeeDetailsComponent, canActivate: [HrisPageGuard] },
  { path: 'ats-dashboard', component: AtsDashboardComponent, canActivate: [AtsPageGuard] },
  { path: 'create-candidate', component: NewCandidateComponent, canActivate: [AtsPageGuard] },
  { path: 'view-banking-approval/:id', component: ViewBankingApprovalComponent },
  { path: 'career-summary', component: CareerSummaryQualificationsComponent },
  { path: 'view-starter-kit-approval/:id', component: ViewStarterKitApprovalComponent },
  { path: 'end-employment/:id', component: EmployeeTerminationComponent },
  { path: 'view-cv-document/:id', component: CvDocumentComponent },
  { path: 'data-reports', component: DataReportsComponent },
  { path: 'data-reports/:id', component: DataReportDetailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }