import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerProblemSetService } from 'src/app/@services/answer-problem-set.service';

@Component({
  selector: 'app-answer-result',
  templateUrl: './answer-result.component.html',
  styleUrl: './answer-result.component.scss'
})
export class AnswerResultComponent implements OnInit {
  answerResult: any = [];

  constructor(private answerProblemSetService: AnswerProblemSetService, private router:Router) { }

  ngOnInit() {
    this.answerResult = this.answerProblemSetService.getAnswerResult();

  }

  backProblemsetpages() {
    console.log(this.answerResult);
    this.router.navigate(['/home/problemsetpages/'+this.answerResult[0].problemSetGuid])
  }
}
