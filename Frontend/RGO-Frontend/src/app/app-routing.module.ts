import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HeaderComponent } from './components/header/header.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ChartComponent } from './components/charts/charts.component';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'home', component: HomeComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'add-user', component: AddUserComponent},
  {path: 'charts', component: ChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
