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
import { HttpClientModule } from '@angular/common/http';
import { GradTodoComponent } from './components/grad-todo/grad-todo.component';
import { EventReducer } from './store/reducers/events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from './store/effects/events.effects';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { environment } from 'src/enviroment/env';
import { WorkshopsPageComponent } from './components/workshops-page/workshops-page.component';
import { EventsComponent } from './components/events/events.component';
import { PersonalProjectComponent } from './components/personal-project/personal-project.component';
import { FormsComponent } from './component/forms/forms.component';


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
    EventsComponent,
    PersonalProjectComponent,
    FormsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({ app: LoginReducer, event: EventReducer }),
    EffectsModule.forRoot([EventsEffects]),
    AuthModule.forRoot({
      domain: environment.AUTH0_Domain_key,// domain
      clientId: environment.AUTH0_CLIENT_ID,// clientId
      authorizationParams: {
        redirect_uri: 'http://localhost:4200'//window.location.origin //env redirect uri
      }
    }),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
