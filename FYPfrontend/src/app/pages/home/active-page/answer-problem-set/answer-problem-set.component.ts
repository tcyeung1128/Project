import { ScriptService } from './../../../../@services/script.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { answerData } from 'src/app/@models/problem-set.model';
import { ProblemSetServiceApiService } from 'src/app/@services-api/problem-set-service-api.service';
import { AnswerProblemSetService } from 'src/app/@services/answer-problem-set.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-answer-problem-set',
  templateUrl: './answer-problem-set.component.html',
  styleUrls: ['./answer-problem-set.component.scss']
})
export class AnswerProblemSetComponent implements OnInit {
  dataValue: any = [];
  answerDataSet: answerData[] = [];

  constructor(private activatedRoute: ActivatedRoute, private scriptService: ScriptService, private sweetalertService: SweetalertService, private router: Router, private problemSetServiceApiService: ProblemSetServiceApiService, private answerProblemSetService:AnswerProblemSetService) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: any) => {
      this.dataValue = data['answerProblemSetValue'];
      console.log(this.dataValue)
      if (this.dataValue === false) {
        this.router.navigate(['/home/homepage']);
      } else {
        for (let i = 0; i < this.dataValue.length; i++) {
          let singleAnswerData: answerData = {
            problemSetGuid: this.dataValue[i].problem_set_guid,
            questionListGuid: this.dataValue[i].question_list_guid,
            questionNumber: i + 1,
            answer: ""
          }
          this.answerDataSet.push(singleAnswerData);
        }
        console.log(this.answerDataSet)
      }
    })
  }

  submit() {
    let checkAnswer = true;
    for (let i = 0; i < this.answerDataSet.length; i++) {
      if (this.answerDataSet[i].problemSetGuid !== this.answerDataSet[0].problemSetGuid) {
        checkAnswer = false;
      }
    }

    if (checkAnswer === true) {
      this.sweetalertService.swal.fire({
        text: "Submitting!",
        allowOutsideClick: false,
        didOpen: () => {
          this.sweetalertService.swal.showLoading();
          this.problemSetServiceApiService.postSubmitAnswer(this.answerDataSet).subscribe((data: any) => {
            setTimeout(() => {
              this.sweetalertService.swal.close();
              this.answerProblemSetService.setAnswerResult(data);
              console.log(data)
              this.router.navigate(['/home/active-page/answer-result'])
            }, 300);
          })
        }
      });
    }
  }
}

