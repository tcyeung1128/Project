import { postStartProblemSet } from 'src/app/@models/problem-set.model';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AnswerProblemSetService } from '../@services/answer-problem-set.service';
import { ProblemSetServiceApiService } from '../@services-api/problem-set-service-api.service';

export const answerProblemSetResolver: ResolveFn<any> = (route, state) => {
  let answerProblemSetService = inject(AnswerProblemSetService);
  let data = answerProblemSetService.getStartProblemSetValue();
  return inject(ProblemSetServiceApiService).getQuestionList(data);
};
