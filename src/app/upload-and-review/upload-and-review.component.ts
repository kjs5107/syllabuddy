import { Component, OnInit } from '@angular/core';
import { UploadAndReviewService } from "./upload-and-review.service";
import * as moment from 'moment';
//import 'dropzone';

declare let Tesseract: any;



@Component({
  selector: 'app',
  templateUrl: './upload-and-review.template.html',
  styleUrls: ['./upload-and-review.style.scss']
})
export class UploadAndReviewComponent implements OnInit {

  constructor(private upLoadAndReviewSerivce: UploadAndReviewService) { }

  ngOnInit() {

    /**
     * I found some base regex online and played around with it some more to suit our needs
     * It will match all the formats I can think of... 2 2 4, 4 2 2, 2 4, 4 2, and 2 2.
     * Where a digit above represents how many digits there are in the string and a space represents a space, /, -, or .
     * For example: 10/10/2010 is 2 2 4.
     *
     * @type {RegExp}
     */
    let dateRegex:RegExp = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4}|\d{2}([.\-/ ])\d{4}|\d{4}([.\-/ ])\d{2}|\d{2}([.\-/ ])\d{2})/g;

    (Tesseract as any).recognize('../../assets/images/testSyllabus.jpg')
      .catch(err => console.error(err))
      .then((result) => {

        let allRawDates = result.text.match(dateRegex);

        console.log(result);
        console.log(allRawDates);

        // TODO: If rawDates don't have three groups, we need to add the group to make it valid for Moment.js


        // Convert rawDates to moment dates
        let allDates = [];
        for (let rawDate in allRawDates) {
          let date = moment(rawDate).format('MM-DD-YYYY');
          allDates.push(date);
        }
        console.log(allDates);

      })
      .finally(resultOrError => console.log(resultOrError))

  }

}
