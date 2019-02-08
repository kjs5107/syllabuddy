import { Component } from '@angular/core';
import { AppService } from "./app.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.template.html',
  styleUrls: ['./app.style.scss']
})
export class AppComponent {

  title = 'syllabuddy';

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.helloWorld()
  }

  helloWorld() {
    console.log(this.appService.helloWorld());
  }

}
