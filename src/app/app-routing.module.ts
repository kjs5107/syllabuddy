import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from "../landing-page/landing-page.component";
import { AppComponent } from "./app.component";

const routes: Routes = [
  { path: 'upload-and-review', component: AppComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: '',
    redirectTo: '/landing-page',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
