import { NgModule } from '@angular/core';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ManageFieldCodeComponent } from './components/custom-fields/manage-field-code/manage-field-code.component';
import { ChartComponent } from './components/charts/charts.component';
import { CreateChartsComponent } from './components/charts/create-charts/create-charts.component';
import { NewEmployeeComponent } from './components/employees/new-employee/new-employee.component';
import { NewFieldCodeComponent } from './components/custom-fields/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/custom-fields/update-field/update-field.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsComponent } from './components/employees/employee-details/employee-details.component';
import { ViewEmployeeComponent } from './components/employees/view-employee/view-employee.component';
import { EmployeeProfileComponent } from './components/employees/employee-profile/employee-profile.component';
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
