import {Component, OnInit, ViewChild} from '@angular/core';
import { UploadAndReviewService } from './upload-and-review.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import * as moment from 'moment';
import * as FilePond from 'filepond';
import * as Sherlock from 'sherlockjs';
import * as ICS from 'ics-js';

declare let Tesseract: any;

const keywords = [
  'test',
  'exam',
  'assessment',
  'practicum',
  'practical',
  'midterm',
  'final',
  'quiz'
];

@Component({
  selector: 'app',
  templateUrl: './upload-and-review.template.html',
  styleUrls: ['./upload-and-review.style.scss']
})
export class UploadAndReviewComponent implements OnInit {

  @ViewChild('myPond') myPond: any;

  defaultState = { status: 'Upload a file to begin', progress: 0};
  recognitionState: { status: string, progress: number } = this.defaultState;

  calendarEvents: {}[] = [];
  assignmentEvents: {}[] = [];

  assignmentTableData: any;
  displayAssignmentTable = false;
  examEvents: {}[] = [];
  examTableData: any;
  displayExamTable = false;
  tableColumns: string[] = ['Import','Title', 'Date', 'Confidence'];


  seenFiles = {};
  pondFiles = [];
  pondOptions = {
    url: 'test',
    class: 'my-filepond',
    multiple: true,
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/jpeg, image/png'
  };

  constructor(private uploadAndReviewSerivce: UploadAndReviewService) {}

  ngOnInit() {}

  pondHandleAddFile(event: any) {
    // extract the File object from the upload event
    const file = event.file.file;

    // check if we've already seen this file
    if (!this.seenFiles[file.name]) {
      this.seenFiles[file.name] = this.processFile(file);
    }

    // no matter what store it in the dictionary
    this.seenFiles[file.name] = file;
  };

  pondHandleRemoveFile(event: any) {
    this.recognitionState = this.defaultState;
  };

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
  };


  roundN(n: number, digits: number = 2): number {
    const p =  Math.pow(10, digits);
    return Math.round( n * p ) / p;
  };


  processFile( file ) {

      // OCR the file
      Tesseract.recognize(file)
        .progress((message) => this.recognitionState = message)
        .catch(err => console.error(err))
        .then((result) => {

          console.log(result);
          console.log(result.confidence);

          const { examEvents,
            assignmentEvents,
            calendarEvents,
            displayExamTable,
            displayAssignmentTable } = this.parseLines(result.lines);

          this.examEvents.push(...examEvents);
          this.assignmentEvents.push(...assignmentEvents);
          this.calendarEvents.push(...calendarEvents);
          this.displayExamTable = displayExamTable;
          this.displayAssignmentTable = displayAssignmentTable;

          this.assignmentTableData = new MatTableDataSource(this.assignmentEvents);
          this.examTableData = new MatTableDataSource(this.examEvents);

          const cal = new ICS.VCALENDAR();
          cal.addProp('VERSION', 2)
          cal.addProp('PRODID', 'XYZ Corp');

          console.log(this.calendarEvents);
          console.log(this.examEvents);
          console.log(this.assignmentEvents);

          this.examTableData.data.forEach((exam) => {
            let x = <any>exam;

            const event = new ICS.VEVENT();
            event.addProp('UID');
            event.addProp('SUMMARY', '[EXAM] ' + x.eventTitle);
            event.addProp('DTSTART', new Date(x.startDate), { VALUE: 'DATE' });
            event.addProp('DTSTAMP', new Date(x.startDate), { VALUE: 'DATE' });

            cal.addComponent(event);
          });

          this.assignmentTableData.data.forEach((assignment) => {
            let x = <any>assignment;

            const event = new ICS.VEVENT();
            event.addProp('UID');
            event.addProp('SUMMARY', '[ASSIGNMENT] ' + x.eventTitle);
            event.addProp('DTSTART', new Date(x.startDate), { VALUE: 'DATE' });
            event.addProp('DTSTAMP', new Date(x.startDate), { VALUE: 'DATE' });

            cal.addComponent(event);
          });
          console.log(cal.toString());
          this.download('test.ics', cal.toString());

          this.recognitionState.status = 'Done';

        })
        .finally(resultOrError => console.log(resultOrError));

  };

  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  parseLines( lines ) {

    let lastDateFound = '';

    const examEvents = [];
    const assignmentEvents = [];
    const calendarEvents = [];

    let displayExamTable =  false;
    let displayAssignmentTable = false;

    lines.forEach((line) => {
      const event = Sherlock.parse(line.text);
      event.confidence = Math.round(10 * line.confidence) / 10;

      if (event.startDate == null && event.endDate == null) {
        event.probableStartDate = moment(lastDateFound).format('MM/DD/YYYY');
        event.needsReview = true;
        calendarEvents.push(event);

      } else {
        lastDateFound = event.startDate;
        event.startDate = moment(event.startDate).format('MM/DD/YYYY');
        event.needsReview = false;
        calendarEvents.push(event);
      }

      for (const word of keywords) {
        if (event.eventTitle != null && event.eventTitle.toLowerCase().includes(word) && !(examEvents.includes(event))) {
          examEvents.push(event);
          displayExamTable = true;
        }

      }
      if (!(assignmentEvents.includes(event)) && !(examEvents.includes(event))) {
        assignmentEvents.push(event);
        displayAssignmentTable = true;
      }
    });
    return {  examEvents, assignmentEvents, calendarEvents,
              displayExamTable, displayAssignmentTable };

  };



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
  addYear = (rawDateSplit: string[], prevMonths: string[], rawDate: string, monthFirst: boolean, seperator: string): string => {

    const rawMonth = monthFirst ? rawDateSplit[0] : rawDateSplit[1];

    // If the month of this date is less than or equal to December, and we've already seen December show up
    if (Number(rawMonth) <= 12 && prevMonths.includes('12')) {
      rawDate = rawDate.concat(seperator + (new Date().getFullYear() + 1) + '');
    } else {
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
    const locale = window.navigator.language;

    // Set locale to moment
    moment.locale(locale);

    // Get locale data
    const localeData = moment.localeData();
    const format = localeData.longDateFormat('L');

    // Test it
    const m2 = moment('5-1-2017', format);
    console.log(m2.format());
    console.log(m2.format(format) + ' using format: ' + format);

    return format;

  };

  testingAssignmentsChange = () => {
    console.log(this.assignmentTableData.data);
  };

  testingExamsChange = () => {
    console.log(this.examTableData.data);
  };


}
