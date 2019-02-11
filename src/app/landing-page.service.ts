import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  constructor() { }

  helloWorld(): string {
    return "Important Data"
  }

}
