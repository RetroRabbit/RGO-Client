import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { HeaderComponent } from './components/header/header.component'
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './store/reducers/login.reducer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EventReducer } from './store/reducers/events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from './store/effects/events.effects';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { environment } from 'src/enviroment/env';
import { WorkshopsComponent } from './components/workshops-page/workshops.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EventsComponent } from './components/events/events.component';
import { PersonalProjectComponent } from './components/personal-project/personal-project.component';
import { UserProfileReducer } from './store/reducers/userprofile.reducer';
import { UserProfileEffects } from './store/effects/userprofile.effects';
import { WorkshopComponent } from './components/workshop/workshop.component';
import { FormsComponent } from './components/forms/forms.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { WorkshopReducer } from './store/reducers/workshop.reducer'
import { WorkshopEffects } from './store/effects/workshop.effects';
import { LoginEffects } from './store/effects/app.effects';
import { ViewableWorkshopPageComponent } from './components/viewable-workshop-page/viewable-workshop-page.component';
import { UserstackReducer } from './store/reducers/userstacks.reducer';
import { UserstacksEffects } from './store/effects/userstacks.effects';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptor/auth0.interceptor';
import { ViewUsersComponent } from './components/view-users/view-users.component';
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
import { StackComponent } from './components/stack/stack.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    PersonalProjectComponent,
    WorkshopsComponent,
    UserProfileComponent,
    EventsComponent,
    PersonalProjectComponent,
    WorkshopComponent,
    FormsComponent,
    AddUserComponent,
    ViewableWorkshopPageComponent,
    StackComponent,
    ViewUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ app: LoginReducer, event: EventReducer, workshop: WorkshopReducer, userstack: UserstackReducer, user: UserProfileReducer, users: UserReducer }),
    EffectsModule.forRoot([LoginEffects, EventsEffects, WorkshopEffects, UserstacksEffects, UserProfileEffects, UserEffects]),
    AuthModule.forRoot({
      domain: environment.AUTH0_Domain_key,// domain
      clientId: environment.AUTH0_CLIENT_ID,// clientId
      authorizationParams: {
        redirect_uri: 'http://localhost:4200'//window.location.origin //env redirect uri
      }
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
    MenuModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
