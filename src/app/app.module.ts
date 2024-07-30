import { NgModule, isDevMode } from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge'
import { SignInComponent } from './components/hris/sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './components/shared-components/store/reducers/sign-in.reducer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { LoginEffects } from './components/shared-components/store/effects/sign-in.effects';
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
import { SaveCustomFieldComponent } from './components/hris/custom-fields/save-custom-field/save-custom-field.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
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
import { ConfirmDialogComponent } from './components/shared-components/confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccordionBankingComponent } from './components/hris/employees/employee-profile/accordions/accordion-banking/accordion-banking.component';
import { AccordionDocumentsComponent } from './components/hris/employees/employee-profile/accordions/accordion-documents/accordion-documents-starterkit/accordion-documents.component';
import { LoadingComponentComponent } from './components/shared-components/loading-component/loading-component.component';
import { AtsDashboardComponent } from './components/ats/ats-dashboard/ats-dashboard.component';
import { NewCandidateComponent } from './components/ats/candidates/new-candidate/new-candidate.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PropertyAccessComponent } from './components/hris/system-settings/property-access/property-access.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AccordionProfileEmployeeDetailsComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-profile-employee-details/accordion-profile-employee-details.component';
import { AccordionProfileContactDetailsComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-profile-contact-details/accordion-profile-contact-details.component';
import { AccordionProfileAdditionalComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-profile-additional-details/accordion-profile-additional.component';
import { AccordionProfilePersonalDetailsComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-profile-personal-details/accordion-profile-personal-details.component';
import { AccordionProfileAddressDetailsComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-profile-address-details/accordion-profile-address-details.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AccordionDocumentsAdditionalComponent } from './components/hris/employees/employee-profile/accordions/accordion-documents/accordion-my-documents/accordion-my-documents.component';
import { ViewStarterKitApprovalComponent } from './components/hris/employees/employee-approvals/view-starter-kit-approval/view-starter-kit-approval.component';
import { ViewBankingApprovalComponent } from './components/hris/employees/employee-approvals/view-banking-approval/view-banking-approval.component';
import { EmployeeOptionsComponent } from './components/hris/employees/employee-options/employee-options.component';
import { EmployeeApprovalsComponent } from './components/hris/employees/employee-approvals/employee-approvals.component';
import { TopNavComponent } from './components/hris/nav-bar/types/top-nav/top-nav.component';
import { SideNavComponent } from './components/hris/nav-bar/types/side-nav/side-nav.component';
import { CareerSummaryQualificationsComponent } from './components/hris/employees/employee-profile/accordions/accordion-career-summary/accordion-career-summary-qualifications/accordion-career-summary-qualifications.component';
import { AccordionEmployeeDocumentsComponent } from './components/hris/employees/employee-profile/accordions/accordion-documents/accordion-employee-documents/accordion-employee-documents.component';
import { AccordionDocumentsCustomDocumentsComponent } from './components/hris/employees/employee-profile/accordions/accordion-documents/accordion-additional-documents/accordion-additional-documents.component';
import { AccordionCertificatesComponent } from './components/hris/employees/employee-profile/accordions/accordion-career-summary/accordion-certificates/accordion-certificates.component';
import { AccordionAdministrativeDocumentsComponent } from './components/hris/employees/employee-profile/accordions/accordion-documents/accordion-administrative-documents/accordion-administrative-documents.component';
import { AccordionCareerAdditionalInformationComponent } from './components/hris/employees/employee-profile/accordions/accordion-profile/accordion-career-additional-information/accordion-career-additional-information.component';
import { AccordionCareerWorkExperienceComponent } from './components/hris/employees/employee-profile/accordions/accordion-career-summary/accordion-career-work-experience/accordion-career-work-experience.component';
import { AccordionSalaryDetailsComponent } from './components/hris/employees/employee-profile/accordions/accordion-career-summary/accordion-salary-details/accordion-salary-details.component';
import { EmployeeTerminationComponent } from './components/hris/employees/employee-termination/employee-termination.component';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input-v16';
import { CvDocumentComponent } from './components/hris/cv-document/cv-document.component';

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
    SaveCustomFieldComponent,
    AdminDashboardComponent,
    EmployeeDetailsComponent,
    PendingBankDetailsComponent,
    ManageEmployeeEventsComponent,
    AddEmployeeEventComponent,
    SystemSettingsComponent,
    ChartReportPdfComponent,
    ConfirmDialogComponent,
    AccordionBankingComponent,
    AccordionDocumentsComponent,
    AccordionEmployeeDocumentsComponent,
    LoadingComponentComponent,
    AtsDashboardComponent,
    NewCandidateComponent,
    PropertyAccessComponent,
    AccordionProfileEmployeeDetailsComponent,
    AccordionProfileContactDetailsComponent,
    AccordionProfileAdditionalComponent,
    AccordionProfilePersonalDetailsComponent,
    AccordionProfileAddressDetailsComponent,
    AccordionDocumentsAdditionalComponent,
    ViewStarterKitApprovalComponent,
    ViewBankingApprovalComponent,
    EmployeeOptionsComponent,
    EmployeeApprovalsComponent,
    TopNavComponent,
    SideNavComponent,
    CareerSummaryQualificationsComponent,
    AccordionEmployeeDocumentsComponent,
    AccordionDocumentsCustomDocumentsComponent,
    AccordionCareerAdditionalInformationComponent,
    AccordionCertificatesComponent,
    AccordionAdministrativeDocumentsComponent,
    AccordionCareerWorkExperienceComponent,
    AccordionSalaryDetailsComponent,
    EmployeeTerminationComponent,
    CvDocumentComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatChipsModule,
    MatSnackBarModule,
    ClipboardModule,
    StoreModule.forRoot({
      token: LoginReducer,
      employee: EmployeeProfileReducer,
    }),
    EffectsModule.forRoot([LoginEffects, EmployeeProfileEffects]),
    AuthModule.forRoot({
      domain: process.env['AUTH0_Domain_key'] || 'null',
      clientId: process.env['AUTH0_CLIENT_ID'] || 'null',
      authorizationParams: {
        redirect_uri: environment.redirect_uri,
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
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
    MatPaginatorModule,
    MatSortModule,
    MatButtonToggleModule,
    DragDropModule,
    NgxMatIntlTelInputComponent,
    MatBadgeModule,
    NgxSkeletonLoaderModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
