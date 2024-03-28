import { NgModule, isDevMode } from '@angular/core';
import { SignInComponent } from './components/hris/sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthConfigService, AuthModule } from '@auth0/auth0-angular';
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './components/shared-components/store/reducers/login.reducer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { LoginEffects } from './components/shared-components/store/effects/app.effects';
import { AuthService } from './services/shared-services/auth-access/auth.service';
import { AuthInterceptor } from './components/shared-components/interceptor/auth0.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeProfileComponent } from './components/hris/employees/employee-profile/employee-profile.component';
import { EmployeeProfileReducer } from './components/shared-components/store/reducers/employee-profile.reducer';
import { EmployeeProfileEffects } from './components/shared-components/store/effects/employeeprofile.effects';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/hris/charts/charts.component';
import { CreateChartsComponent } from './components/hris/charts/create-charts/create-charts.component';

import { ReportComponent } from './components/hris/charts/chart-reports/chart-reports.component';
import { RoleManagerComponent } from './components/hris/role-manager/role-manager.component';
import { AdminDashboardComponent } from './components/hris/admin-dashboard/admin-dashboard.component';
import { NewEmployeeComponent } from './components/hris/employees/new-employee/new-employee.component';
import { ManageFieldCodeComponent } from './components/hris/custom-fields/manage-field-code/manage-field-code.component';
import { ViewEmployeeComponent } from './components/hris/employees/view-employee/view-employee.component';
//import { NewFieldCodeComponent } from './components/hris/custom-fields/new-field-code/new-field-code.component';
import { UpdateFieldComponent } from './components/hris/custom-fields/save-custom-field/save-custom-field.component';
import { EvaluationsComponent } from './components/hris/evaluations/evaluations.component';
import { EmployeeEvaluationsComponent } from './components/hris/evaluations/employee-evaluations/employee-evaluations.component';
import { TemplateItemsComponent } from './components/hris/evaluations/template-items/template-items.component';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { PendingBankDetailsComponent } from './components/hris/employees/pending-bank-details/pending-bank-details.component';
import { EmployeeDetailsComponent } from './components/hris/employees/employee-details/employee-details.component';
import { ManageEmployeeEventsComponent } from './components/hris/manage-employee-events/manage-employee-events.component';
import { AddEmployeeEventComponent } from './components/hris/manage-employee-events/add-employee-event/add-employee-event.component';
import { SystemSettingsComponent } from './components/hris/system-settings/system-settings.component';

import { ChartReportPdfComponent } from './components/hris/charts/chart-report-pdf/chart-report-pdf.component';
import { NavBarComponent } from './components/hris/nav-bar/nav-bar.component';
import { ConfirmDialogComponent } from './components/shared-components/confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccordionProfileComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-profile.component';
import { AccordionBankingComponent } from './components/hris/employees/employee-profile/accordions/accordion-banking/accordion-banking.component';
import { AccordionDocumentsComponent } from './components/hris/employees/employee-profile/accordions/accordion-documents/accordion-documents.component';
import { LoadingComponentComponent } from './components/shared-components/loading-component/loading-component.component';
import { AtsDashboardComponent } from './components/ats/ats-dashboard/ats-dashboard.component';
import { NewCandidateComponent } from './components/ats/candidates/new-candidate/new-candidate.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PropertyAccessComponent } from './components/hris/system-settings/property-access/property-access.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
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
    //NewFieldCodeComponent,
    UpdateFieldComponent,
    AdminDashboardComponent,
    EmployeeDetailsComponent,
    PendingBankDetailsComponent,
    ManageEmployeeEventsComponent,
    AddEmployeeEventComponent,
    SystemSettingsComponent,
    ChartReportPdfComponent,
    NavBarComponent,
    ConfirmDialogComponent,
    AccordionProfileComponent,
    AccordionBankingComponent,
    AccordionDocumentsComponent,
    LoadingComponentComponent,
    AtsDashboardComponent,
    NewCandidateComponent,
    PropertyAccessComponent,
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
      domain: process.env['AUTH0_Domain_key'] || 'null',
      clientId: process.env['AUTH0_CLIENT_ID'] || 'null',
      authorizationParams: {
        redirect_uri: environment.redirect_uri,
      },
    }),
    HttpClientModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatProgressSpinnerModule,
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
    MatButtonToggleModule,
    DragDropModule,
    NgxSkeletonLoaderModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
