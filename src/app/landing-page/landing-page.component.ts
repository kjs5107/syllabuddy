import { Component } from '@angular/core';
import { LandingPageService } from "./landing-page.service"
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.template.html',
  styleUrls: ['./landing-page.style.scss']
})
export class LandingPageComponent {

  title = 'Syllabuddy';
  twoWayExample = 'This is cool!';

  // Create an instance of our LandingPageService
  constructor(private landingPageService: LandingPageService) {
    console.log("landing");
  }

  // Angular Lifecycle Hook
  ngOnInit() {
    this.helloWorld()
  }

  helloWorld() {
    console.log(this.landingPageService.helloWorld());
  }

  setTwoWayBinding() {
    this.twoWayExample = "Or is it...?";
    this.checkTwoWayBinding();
  }

  checkTwoWayBinding() {
    console.log(this.twoWayExample);
  }

}
