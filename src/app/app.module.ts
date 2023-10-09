import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { HeaderComponent } from './components/header/header.component';
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './store/reducers/login.reducer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { environment } from 'src/enviroment/env';
import { LoginEffects } from './store/effects/app.effects';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptor/auth0.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeProfileComponent } from './components/employees/employee-profile/employee-profile.component';
import { EmployeeProfileComponent } from './components/employee/employee-profile/employee-profile.component';
import { EmployeeProfileReducer } from './store/reducers/employee-profile.reducer';
import { EmployeeProfileEffects } from './store/effects/employeeprofile.effects';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/charts/charts.component';
import { CreateChartsComponent } from './components/charts/create-charts/create-charts.component';
import { NgToastModule } from 'ng-angular-popup';
import { ReportComponent } from './components/charts/chart-reports/chart-reports.component';
import { RoleManagerComponent } from './components/role-manager/role-manager.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EmployeeRoleManagerComponent } from './components/employees/employee-role-manager/employee-role-manager.component';
import { NewEmployeeComponent } from './components/employees/new-employee/new-employee.component';
import { ManageFieldCodeComponent } from './components/custom-fields/manage-field-code/manage-field-code.component';
import { ViewEmployeeComponent } from './components/employees/view-employee/view-employee.component';
import { NewFieldCodeComponent } from './components/custom-fields/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/custom-fields/update-field/update-field.component';
import { EvaluationsComponent } from './components/evaluations/evaluations.component';
import { EmployeeEvaluationsComponent } from './components/evaluations/employee-evaluations/employee-evaluations.component';
import { TemplateItemsComponent } from './components/evaluations/template-items/template-items.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EmployeeRoleManagerComponent } from './components/employee/employee-role-manager/employee-role-manager.component';
import { NewEmployeeComponent } from './components/new-employee/new-employee.component';
import { ManageFieldCodeComponent } from './components/manage-field-code/manage-field-code.component';
import { ViewEmployeeComponent } from './components/employee/view-employee/view-employee.component';
import { NewFieldCodeComponent } from './components/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/update-field/update-field.component';
import { EvaluationsComponent } from './components/employee/evaluations/evaluations.component';
import { EmployeeEvaluationsComponent } from './components/employee/employee-evaluations/employee-evaluations.component';
import { TemplateItemsComponent } from './components/template-items/template-items.component';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav'; 
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    EmployeeProfileComponent,
    ChartComponent,
    CreateChartsComponent,
    ReportComponent,
    RoleManagerComponent,
    EmployeeRoleManagerComponent,
    NewEmployeeComponent,
    ManageFieldCodeComponent,
    ViewEmployeeComponent,
    EvaluationsComponent,
    EmployeeEvaluationsComponent,
    TemplateItemsComponent,
    NewFieldCodeComponent,
    UpdateFieldComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    StoreModule.forRoot({
      app: LoginReducer,
      employee : EmployeeProfileReducer,
    }),
    EffectsModule.forRoot([LoginEffects, EmployeeProfileEffects]),
    AuthModule.forRoot({
      domain: environment.AUTH0_Domain_key, // domain
      clientId: environment.AUTH0_CLIENT_ID, // clientId
      authorizationParams: {
        redirect_uri: 'http://localhost:4200', //window.location.origin //env redirect uri
      },
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    NgToastModule,
    MatButtonModule, 
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    HomeComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
