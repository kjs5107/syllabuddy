import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  helloWorld(): string {
    return "Important Data"
  }

}
