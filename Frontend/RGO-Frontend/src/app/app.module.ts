import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { HeaderComponent } from './components/header/header.component'
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './store/reducers/login.reducer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GradTodoComponent } from './components/grad-todo/grad-todo.component';
import { EventReducer } from './store/reducers/events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from './store/effects/events.effects';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { environment } from 'src/enviroment/env';
import { WorkshopsPageComponent } from './components/workshops-page/workshops-page.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EventsComponent } from './components/events/events.component';
import { PersonalProjectComponent } from './components/personal-project/personal-project.component';
import { UserProfileReducer } from './store/reducers/userprofile.reducer';
import { UserProfileEffects } from './store/effects/userprofile.effects';
import { WorkshopComponent } from './components/workshop/workshop.component';
import { FormsComponent } from './components/forms/forms.component';
import { WorkshopReducer } from './store/reducers/workshop.reducer'
import { WorkshopEffects } from './store/effects/workshop.effects';
import { LoginEffects } from './store/effects/app.effects';
import { ViewableWorkshopPageComponent } from './components/viewable-workshop-page/viewable-workshop-page.component';
import { UserstackReducer } from './store/reducers/userstacks.reducer';
import { UserstacksEffects } from './store/effects/userstacks.effects';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptor/auth0.interceptor';
import { UserReducer } from './store/reducers/user.reducer';
import { UserEffects } from './store/effects/user.effects';



@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    HeaderComponent,
    GradTodoComponent,
    SidebarComponent,
    PersonalProjectComponent,
    WorkshopsPageComponent,
    UserProfileComponent,
    EventsComponent,
    PersonalProjectComponent,
    WorkshopComponent,
    FormsComponent,
    ViewableWorkshopPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
