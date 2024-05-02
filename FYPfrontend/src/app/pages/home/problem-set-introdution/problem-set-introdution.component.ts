import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { postStartProblemSet, problemSetItem } from 'src/app/@models/problem-set.model';
import { ProblemSetServiceApiService } from 'src/app/@services-api/problem-set-service-api.service';
import { AnswerProblemSetService } from 'src/app/@services/answer-problem-set.service';

@Component({
  selector: 'app-problem-set-introdution',
  templateUrl: './problem-set-introdution.component.html',
  styleUrl: './problem-set-introdution.component.scss'
})
export class ProblemSetIntrodutionComponent {
  setProblemSet: string = "all";
  setProblemNumber!: number;
  getProblemSetItemValue!: problemSetItem;

  constructor(private problemSetServiceAPIService: ProblemSetServiceApiService, private activatedRoute: ActivatedRoute, private answerProblemSetService: AnswerProblemSetService) { }

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
}
