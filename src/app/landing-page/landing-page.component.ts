import { Component } from '@angular/core';
import { LandingPageService } from "./landing-page.service"
import { RouterOutlet } from '@angular/router';
import * as ICS from 'ics-js';

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

    const cal = new ICS.VCALENDAR();
    cal.addProp('VERSION', 2)
    cal.addProp('PRODID', 'XYZ Corp');

    const event = new ICS.VEVENT();
    event.addProp('UID');
    event.addProp('SUMMARY', 'EXAM: AH');
    event.addProp('DTSTART', new Date('2019-03-20 10:00:00'));
    event.addProp('DTEND', new Date('2019-03-20 11:00:00'));
    event.addProp('DTSTAMP', new Date('2019-03-20 10:00:00'), { VALUE: 'DATE-TIME' });
    cal.addComponent(event);
    // console.log(cal.toString());
    // this.download("test.ics", cal.toString());
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
