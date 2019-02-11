// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Internal Modules, Components, and Services
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageService } from "./landing-page.service";


@NgModule({
  declarations: [
    LandingPageComponent
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
