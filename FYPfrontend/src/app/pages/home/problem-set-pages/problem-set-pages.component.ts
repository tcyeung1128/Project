import { AnswerProblemSetService } from './../../../@services/answer-problem-set.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { postStartProblemSet, problemSetItem } from 'src/app/@models/problem-set.model';
import { ProblemSetServiceApiService } from 'src/app/@services-api/problem-set-service-api.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-problem-set-pages',
  templateUrl: './problem-set-pages.component.html',
  styleUrls: ['./problem-set-pages.component.scss']
})

export class ProblemSetPagesComponent implements OnInit {
  setProblemSet: string = "all";
  setProblemNumber!: number;
  getProblemSetItemValue!: problemSetItem;

  constructor(private problemSetServiceAPIService: ProblemSetServiceApiService, private activatedRoute: ActivatedRoute, private answerProblemSetService: AnswerProblemSetService, private router: Router, private sweetalertService: SweetalertService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data) => {
        //console.log(data['problemSetItemValue']);
        this.getProblemSetItemValue = {
          personal_information_guid_fk: data['problemSetItemValue'].personal_information_guid_fk,
          problem_set_description: data['problemSetItemValue'].data.problem_set_description,
          problem_set_guid: data['problemSetItemValue'].data.problem_set_guid,
          problem_set_name: data['problemSetItemValue'].data.problem_set_name,
          isMyProblemSet: data['problemSetItemValue'].isMyProblemSet,
          isSubscribe: data['problemSetItemValue'].isSubscribe,
          questionListCount: data['problemSetItemValue'].questionListCount
        };

        this.setProblemNumber = data['problemSetItemValue'].questionListCount;
      });
  }

  onSetProblemSetChange() {
    console.log(this.setProblemSet);
  }

  onSetProblemNumber() {
    console.log('onSetProblemNumber')
    if (this.setProblemNumber > this.getProblemSetItemValue.questionListCount) {
      this.setProblemNumber = this.getProblemSetItemValue.questionListCount
    } else if (this.setProblemNumber < 1) {
      this.setProblemNumber = 1
    }
  }

  startProblemSet() {
    let body: postStartProblemSet = {
      guid: this.getProblemSetItemValue.problem_set_guid,
      setProblemSet: this.setProblemSet,
      setProblemNumber: this.setProblemNumber
    }
    console.log(body);
    this.answerProblemSetService.setStartProblemSetValue(body);
  }

  SubscribeProblemSet() {
    if (this.getProblemSetItemValue.isSubscribe == false) {
      this.getProblemSetItemValue.isSubscribe = true;
      this.problemSetServiceAPIService.getSubscribeProblemSet(this.getProblemSetItemValue.problem_set_guid).subscribe((value: any) => {

      })
    }
  }

  UnsubscribeProblemSet() {
    if (this.getProblemSetItemValue.isSubscribe == true) {
      this.getProblemSetItemValue.isSubscribe = false;
      this.problemSetServiceAPIService.getUnsubscribeProblemSet(this.getProblemSetItemValue.problem_set_guid).subscribe((value: any) => {

      })
    }
  }

  recordPage() {
    this.sweetalertService.swal.fire({
      text: "Submitting!",
      allowOutsideClick: false,
      didOpen: () => {
        this.sweetalertService.swal.showLoading();
        console.log(this.getProblemSetItemValue.problem_set_guid);

        this.problemSetServiceAPIService.getRecordPage(this.getProblemSetItemValue.problem_set_guid).subscribe((data: any) => {
          console.log('datae')
          setTimeout(() => {
            //this.sweetalertService.swal.close();
            this.answerProblemSetService.setRecordPageValue(data);
            console.log(this.answerProblemSetService.getRecordPageValue())
            if (data !== false) {
              this.sweetalertService.swal.close();
              this.router.navigate(['home/problem-set-history/' + this.getProblemSetItemValue.problem_set_guid])
            }
          }, 300);

        })
      }
    });

    // this.problemSetServiceAPIService.getRecordPage(this.getProblemSetItemValue.problem_set_guid).subscribe((data: any) => {
    //   this.answerProblemSetService.setRecordPageValue(data);
    //   console.log(this.answerProblemSetService.getRecordPageValue())
    //   this.router.navigate(['home/problem-set-history/' + this.getProblemSetItemValue.problem_set_guid])
    // })
  }
}