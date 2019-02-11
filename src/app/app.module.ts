// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Internal Modules, Components, and Services
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [LandingPageComponent]
})
export class AppModule { }
