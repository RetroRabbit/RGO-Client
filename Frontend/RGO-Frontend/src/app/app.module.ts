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
import { AddUserComponent } from './components/add-user/add-user.component';
import { LoginEffects } from './store/effects/app.effects';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptor/auth0.interceptor';
import { UserReducer } from './store/reducers/user.reducer';
import { UserEffects } from './store/effects/user.effects';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { EmployeeProfileReducer } from './store/reducers/employee-profile.reducer';
import { EmployeeProfileEffects } from './store/effects/employeeprofile.effects';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/charts/charts.component';
import { CreateChartsComponent } from './components/create-charts/create-charts.component';
import { NgToastModule } from 'ng-angular-popup';
import { ReportComponent } from './components/chart-reports/chart-reports.component';
import { RoleManagerComponent } from './components/role-manager/role-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    AddUserComponent,
    EmployeeProfileComponent,
    ChartComponent,
    CreateChartsComponent,
    ReportComponent,
    RoleManagerComponent
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
      users: UserReducer,
    }),
    EffectsModule.forRoot([LoginEffects, UserEffects, EmployeeProfileEffects]),
    AuthModule.forRoot({
      domain: environment.AUTH0_Domain_key, // domain
      clientId: environment.AUTH0_CLIENT_ID, // clientId
      authorizationParams: {
        redirect_uri: 'http://localhost:4200', //window.location.origin //env redirect uri
      },
    }),
    HttpClientModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    MenuModule,
    NgToastModule
  
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    HomeComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
