import { Component, OnInit } from '@angular/core';
import { AppService } from "./app.service";

@Component({
  selector: 'app',
  templateUrl: './app.template.html',
  styleUrls: ['./app.style.scss']
})
export class AppComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() {

  }

}
