import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { HeaderComponent } from './header/header.component'

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule.forRoot({
      domain: 'dev-lo44tfx8p4oswi5b.us.auth0.com',// domain
      clientId: '1MC0K3mWmgh3cFZ2ZNPjvJTAa0YVjXde',// clientId
      authorizationParams: {
        redirect_uri: 'http://localhost:4200'//window.location.origin //env redirect uri
      }
      // httpInterceptor: {
      //   allowedList: [
      //     {
      //       uri: environment.Api_Url + '*',
      //       tokenOptions: {
      //         authorizationParams: {
      //           audience: environment.Security_Audience,
      //         },
      //       },
      //     },
      //   ],
      // },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
