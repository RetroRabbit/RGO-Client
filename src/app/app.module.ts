import { NgModule } from '@angular/core';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './store/reducers/login.reducer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/enviroment/env';
import { LoginEffects } from './store/effects/app.effects';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptor/auth0.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeProfileComponent } from './components/employees/employee-profile/employee-profile.component';
import { EmployeeProfileReducer } from './store/reducers/employee-profile.reducer';
import { EmployeeProfileEffects } from './store/effects/employeeprofile.effects';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/charts/charts.component';
import { CreateChartsComponent } from './components/charts/create-charts/create-charts.component';
import { NgToastModule } from 'ng-angular-popup';
import { ReportComponent } from './components/charts/chart-reports/chart-reports.component';
import { RoleManagerComponent } from './components/role-manager/role-manager.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NewEmployeeComponent } from './components/employees/new-employee/new-employee.component';
import { ManageFieldCodeComponent } from './components/custom-fields/manage-field-code/manage-field-code.component';
import { ViewEmployeeComponent } from './components/employees/view-employee/view-employee.component';
import { NewFieldCodeComponent } from './components/custom-fields/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/custom-fields/update-field/update-field.component';
import { EvaluationsComponent } from './components/evaluations/evaluations.component';
import { EmployeeEvaluationsComponent } from './components/evaluations/employee-evaluations/employee-evaluations.component';
import { TemplateItemsComponent } from './components/evaluations/template-items/template-items.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableModule } from 'primeng/table';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatStepperModule } from '@angular/material/stepper';
import { PendingBankDetailsComponent } from './components/employees/pending-bank-details/pending-bank-details.component';
import { EmployeeDetailsComponent } from './components/employees/employee-details/employee-details.component';
import { ManageEmployeeEventsComponent } from './components/manage-employee-events/manage-employee-events.component';
import { AddEmployeeEventComponent } from './components/manage-employee-events/add-employee-event/add-employee-event.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';



import { MatChipsModule } from '@angular/material/chips';
import { ChartReportPdfComponent } from './components/charts/chart-report-pdf/chart-report-pdf.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    EmployeeProfileComponent,
    ChartComponent,
    CreateChartsComponent,
    ReportComponent,
    RoleManagerComponent,
    NewEmployeeComponent,
    ManageFieldCodeComponent,
    ViewEmployeeComponent,
    EvaluationsComponent,
    EmployeeEvaluationsComponent,
    TemplateItemsComponent,
    NewFieldCodeComponent,
    UpdateFieldComponent,
    AdminDashboardComponent,
    EmployeeDetailsComponent,
    PendingBankDetailsComponent,
    ManageEmployeeEventsComponent,
    AddEmployeeEventComponent,
    SystemSettingsComponent,
    ChartReportPdfComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatChipsModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      app: LoginReducer,
      employee: EmployeeProfileReducer,
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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    NgxFileDropModule,
    MatStepperModule,
    TableModule,
    MatPaginatorModule,
    MatSortModule,
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
