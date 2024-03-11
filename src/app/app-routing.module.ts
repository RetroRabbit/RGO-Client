import { NgModule } from '@angular/core';
import { SignInComponent } from './components/hris/sign-in/sign-in.component';
import { ManageFieldCodeComponent } from './components/hris/custom-fields/manage-field-code/manage-field-code.component';
import { ChartComponent } from './components/hris/charts/charts.component';
import { CreateChartsComponent } from './components/hris/charts/create-charts/create-charts.component';
import { NewEmployeeComponent } from './components/hris/employees/new-employee/new-employee.component';
import { NewFieldCodeComponent } from './components/hris/custom-fields/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/hris/custom-fields/update-field/update-field.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsComponent } from './components/hris/employees/employee-details/employee-details.component';
import { ViewEmployeeComponent } from './components/hris/employees/view-employee/view-employee.component';
import { EmployeeProfileComponent } from './components/hris/employees/employee-profile/employee-profile.component';
import { SystemSettingsComponent } from './components/hris/system-settings/system-settings.component';
import { AdminDashboardComponent } from './components/hris/admin-dashboard/admin-dashboard.component';
import { AtsDashboardComponent } from './components/ats/ats-dashboard/ats-dashboard.component';
import { HrisPageGuard } from './hris-guard.guard';
import { AtsPageGuard } from './ats-guard.guard';
import { NewcandidateComponentComponent } from './components/ats/candidates/new-candidates/newcandidate-component/newcandidate-component.component';


const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [HrisPageGuard]},
  { path: 'employees', component: ViewEmployeeComponent, canActivate: [HrisPageGuard] },
  { path: 'profile', component: EmployeeProfileComponent, canActivate: [HrisPageGuard] },
  { path: 'profile/:id', component: EmployeeProfileComponent, canActivate: [HrisPageGuard] },
  { path: 'system-settings', component: SystemSettingsComponent, canActivate: [HrisPageGuard] },
  { path: 'manage-field', component: ManageFieldCodeComponent, canActivate: [HrisPageGuard] },
  { path: 'charts', component: ChartComponent, canActivate: [HrisPageGuard] },
  { path: 'create-charts', component: CreateChartsComponent, canActivate: [HrisPageGuard] },
  { path: 'create-employee', component: NewEmployeeComponent, canActivate: [HrisPageGuard] },
  { path: 'new-fieldcode', component: NewFieldCodeComponent, canActivate: [HrisPageGuard] },
  { path: 'update-fieldcode', component: UpdateFieldComponent, canActivate: [HrisPageGuard] },
  { path: 'employee-details', component: EmployeeDetailsComponent, canActivate: [HrisPageGuard] },
  { path: 'ats-dashboard', component: AtsDashboardComponent, canActivate: [AtsPageGuard]},
  { path: 'create-candidate', component: NewcandidateComponentComponent, canActivate: [AtsPageGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }