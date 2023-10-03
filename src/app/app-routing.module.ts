import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HeaderComponent } from './components/header/header.component';
import { ManageFieldCodeComponent } from './components/manage-field-code/manage-field-code.component';
import { ChartComponent } from './components/charts/charts.component';
import { CreateChartsComponent } from './components/create-charts/create-charts.component';
import { NewEmployeeComponent } from './components/new-employee/new-employee.component';
import { NewFieldCodeComponent } from './components/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/update-field/update-field.component';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'home', component: HomeComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'manage-field', component: ManageFieldCodeComponent},
  {path: 'charts', component: ChartComponent},
  {path: 'create-charts', component: CreateChartsComponent},
  {path: 'new-employee', component: NewEmployeeComponent},
  {path: 'new-fieldcode', component: NewFieldCodeComponent},
  {path: 'update-fieldcode', component: UpdateFieldComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
