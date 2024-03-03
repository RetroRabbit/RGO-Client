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
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';
import { AdminDashboardComponent } from './components/hris/admin-dashboard/admin-dashboard.component';
import { AtsDashboardComponent } from './components/ats/ats-dashboard/ats-dashboard.component';




const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'dashboard', component: AdminDashboardComponent},
  {path: 'employees', component: ViewEmployeeComponent},
  {path: 'profile', component: EmployeeProfileComponent},
  {path: 'profile/:id', component: EmployeeProfileComponent},
  {path: 'system-settings', component: SystemSettingsComponent},
  {path: 'manage-field', component: ManageFieldCodeComponent},
  {path: 'charts', component: ChartComponent},
  {path: 'create-charts', component: CreateChartsComponent},
  {path: 'create-employee', component: NewEmployeeComponent},
  {path: 'new-fieldcode', component: NewFieldCodeComponent},
  {path: 'update-fieldcode', component: UpdateFieldComponent},
  {path: 'employee-details', component: EmployeeDetailsComponent},
  {path: 'ats-dashboard', component: AtsDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
