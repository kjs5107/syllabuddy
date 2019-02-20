import {Component, OnInit, ViewChild} from '@angular/core';
import { UploadAndReviewService } from "./upload-and-review.service";
import * as moment from 'moment';
import * as FilePond from 'filepond';
import * as Sherlock from 'sherlockjs';


declare let Tesseract: any;



@Component({
  selector: 'app',
  templateUrl: './upload-and-review.template.html',
  styleUrls: ['./upload-and-review.style.scss']
})
export class UploadAndReviewComponent implements OnInit {


  @ViewChild('myPond') myPond: any;

  defaultState = { status: 'Upload a file to begin', progress: 0};
  recognitionState: { status: string, progress: number } = this.defaultState;

  pondFiles = [

  ];

  pondOptions = {
    url: 'test',
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/jpeg, image/png'
  };

  pondHandleAddFile(event: any) {
    // extract the File object from the upload event
    const file = event.file.file;
    this.extractDates(file);
  }

  pondHandleRemoveFile(event: any){
    this.recognitionState = this.defaultState;
  }

  /**
   * Convert any uploaded file to a base64 string
   * @param file
   */
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  roundN(n: number, digits: number = 2): number {
    const p =  Math.pow(10, digits);
    return Math.round( n * p ) / p;
  }


  /**
   * For now this function's job is to extract dates from the passed in image
   *
   * @param f - A file object
   */
  extractDates(f){

    /**
     * I found some base regex online and played around with it some more to suit our needs
     * It will match all the number based formats I can think of ... 2 2 4, 4 2 2, 2 4, 4 2, and 2 2.
     * Where a digit above represents how many digits there are in the string and a space represents a space, /, -, or .
     * For example: 10/10/2010 is 2 2 4.
     *
     * @type {RegExp}
     */
    let dateRegex: RegExp = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4}|\d{2}([.\-/ ])\d{4}|\d{4}([.\-/ ])\d{2}|\d{2}([.\-/ ])\d{2})/g;
    // TODO: Need to add support for string based formats as well...e.g. Fri Feb 15...

    Tesseract.recognize(f)
      .progress((message) => this.recognitionState = message )
      .catch(err => console.error(err))
      .then((result) => {

        console.log(result);
        console.log(result.confidence);

        let calendarEventsWithDates: {}[] = [];
        let calendarEventsWithoutDates: {}[] = [];
        let lastDateFound: string = "";

        result.lines.forEach((line) => {
          let event = Sherlock.parse(line.text);

          if (event.startDate == null && event.endDate == null) {
            event.probableStartDate = lastDateFound;
            calendarEventsWithoutDates.push(event);
          } else {
            lastDateFound = event.startDate;
            calendarEventsWithDates.push(event);
          }
        });

        console.log(calendarEventsWithDates);
        console.log(calendarEventsWithoutDates);



        // let allRawDates: string[] = result.text.match(dateRegex);

        // // Establish which date format to use
        // let format = this.grabDateFormat();

        // // Convert rawDates to moment dates
        // let allDates = [];
        // let prevMonths: string[] = [];
        // for (let rawDate of allRawDates) {

        //   // If rawDate doesn't have three groups, we need to add the group to make it valid for Moment.js
        //   // If only two groups, we're going to assume it's either MM/DD or DD/MM.
        //   // If it's MM/YYYY or YYYY/MM it will most likely be in word form, so we're ignoring those for now.
        //   // So we need to inject a year into the string properly.
        //   let seperator = /[.,\/ -]/;
        //   let rawDateSplit = rawDate.split(seperator);
        //   if(rawDateSplit.length === 2) {

        //     switch(format) {
        //       case 'MM/DD/YYYY':
        //       case 'MM.DD.YYYY':
        //       case 'MM-DD-YYYY':
        //       case 'MM DD YYYY':
        //         rawDate = this.addYear(rawDateSplit, prevMonths, rawDate, true, format.match(seperator)[0]);
        //         break;
        //       case 'DD/MM/YYYY':
        //       case 'DD.MM.YYYY':
        //       case 'DD-MM-YYYY':
        //       case 'DD MM YYYY':
        //         rawDate = this.addYear(rawDateSplit, prevMonths, rawDate, false, format.match(seperator)[0]);
        //         break
        //     }

        //   }

        //   let date = moment(rawDate, format).format(format);
        //   allDates.push(date);

        // }
        // console.log(allDates);

      })
      .finally(resultOrError => console.log(resultOrError))
  }

  constructor(private uploadAndReviewSerivce: UploadAndReviewService) {}

  ngOnInit() {



  }


  /**
   * We're going to assume we received the dates in chronological order since it's a syllabus
   * So we're going to set the year to the current year unless we go past December, then it's next year
   *
   * @param {string[]} rawDateSplit
   * @param {string[]} prevMonths
   * @param {string} rawDate
   * @param {boolean} monthFirst
   * @param {string} seperator
   */
  addYear = (rawDateSplit:string[], prevMonths:string[], rawDate:string, monthFirst:boolean, seperator: string): string => {

    let rawMonth = monthFirst ? rawDateSplit[0]: rawDateSplit[1];

    // If the month of this date is less than or equal to December, and we've already seen December show up
    if(Number(rawMonth) <= 12 && prevMonths.includes('12')) {
      rawDate = rawDate.concat(seperator + (new Date().getFullYear() + 1) + '');
    }
    else {
      rawDate = rawDate.concat(seperator + new Date().getFullYear() + '');
    }
    prevMonths.push(rawMonth);

    return rawDate;

  };

  /**
   * Ascertain the user's locale to determine the Date Format to pass into moment.js
   *
   * @returns {string}
   */
  grabDateFormat = (): string => {

    // Get user locale
    let locale = window.navigator.language;

    // Set locale to moment
    moment.locale(locale);

    // Get locale data
    let localeData = moment.localeData();
    let format = localeData.longDateFormat('L');

    // Test it
    let m2 = moment('5-1-2017', format);
    console.log(m2.format());
    console.log(m2.format(format) + ' using format: ' + format);

    return format;

  };


}
