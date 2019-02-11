import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { UploadAndReviewComponent } from "./upload-and-review/upload-and-review.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full'},
  { path: 'upload-and-review', component: UploadAndReviewComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
