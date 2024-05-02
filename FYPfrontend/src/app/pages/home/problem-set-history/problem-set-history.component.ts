import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerProblemSetService } from 'src/app/@services/answer-problem-set.service';

@Component({
  selector: 'app-problem-set-history',
  templateUrl: './problem-set-history.component.html',
  styleUrl: './problem-set-history.component.scss'
})
export class ProblemSetHistoryComponent implements OnInit {
  recordPageValue: any;

  constructor(private answerProblemSetService: AnswerProblemSetService, private router: Router) {

  }
  ngOnInit(): void {
    this.recordPageValue = this.answerProblemSetService.getRecordPageValue()
    console.log(this.recordPageValue)
  }
}
