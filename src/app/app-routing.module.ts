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
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard]},
  { path: 'employees', component: ViewEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: EmployeeProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: EmployeeProfileComponent, canActivate: [AuthGuard] },
  { path: 'system-settings', component: SystemSettingsComponent, canActivate: [AuthGuard] },
  { path: 'manage-field', component: ManageFieldCodeComponent, canActivate: [AuthGuard] },
  { path: 'charts', component: ChartComponent, canActivate: [AuthGuard] },
  { path: 'create-charts', component: CreateChartsComponent, canActivate: [AuthGuard] },
  { path: 'create-employee', component: NewEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'new-fieldcode', component: NewFieldCodeComponent, canActivate: [AuthGuard] },
  { path: 'update-fieldcode', component: UpdateFieldComponent, canActivate: [AuthGuard] },
  { path: 'employee-details', component: EmployeeDetailsComponent, canActivate: [AuthGuard] },
  { path: 'ats-dashboard', component: AtsDashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }