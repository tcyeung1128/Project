import { Injectable } from '@angular/core';
import { postStartProblemSet } from '../@models/problem-set.model';
import { ProblemSetServiceApiService } from '../@services-api/problem-set-service-api.service';

@Injectable({
  providedIn: 'root'
})
export class AnswerProblemSetService {
  private postStartProblemSetValue!:postStartProblemSet;
  private answerResult:any;
  private recordPageValue:any;

  constructor(private problemSetServiceAPIService:ProblemSetServiceApiService) { }

  setStartProblemSetValue(data:postStartProblemSet){
    this.postStartProblemSetValue=data;
    return this.postStartProblemSetValue;
    // this.problemSetServiceAPIService.getQuestionList(data).subscribe((data: any) => {
    //   console.log("test data")
    //   console.log(data);
    // });
  }

  getStartProblemSetValue(){
    //return this.getStartProblemSetValue;
    return this.postStartProblemSetValue;
  }

  setAnswerResult(data:any){
    this.answerResult=data;
  }

  getAnswerResult(){
    return this.answerResult;
  }

  setRecordPageValue(data:any){
    this.recordPageValue=data;
  }

  getRecordPageValue(){
    return this.recordPageValue;
  }
}
