import { Component } from '@angular/core';
import { AppService } from "./app.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.template.html',
  styleUrls: ['./app.style.scss']
})
export class AppComponent {

  title = 'Syllabuddy';
  twoWayExample = 'This is cool!';

  // Create an instance of our AppService
  constructor(private appService: AppService) { }

  // Angular Lifecycle Hook
  ngOnInit() {
    this.helloWorld()
  }

  helloWorld() {
    console.log(this.appService.helloWorld());
  }

  setTwoWayBinding() {
    this.twoWayExample = "Or is it...?";
    this.checkTwoWayBinding();
  }

  checkTwoWayBinding() {
    console.log(this.twoWayExample);
  }

}
