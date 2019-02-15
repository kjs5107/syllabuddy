import { Component, OnInit } from '@angular/core';
import { UploadAndReviewService } from "./upload-and-review.service";
import 'dropzone';


@Component({
  selector: 'app',
  templateUrl: './upload-and-review.template.html',
  styleUrls: ['./upload-and-review.style.scss']
})
export class UploadAndReviewComponent implements OnInit {

  constructor(private upLoadAndReviewSerivce: UploadAndReviewService) { }

  ngOnInit() {

  }

}
