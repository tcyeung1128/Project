import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProblemSetServiceApiService {

  constructor(private http: HttpClient) { }

  getMyProblemSetList(page: number) {
    let url: string = `api/problemset/getMyProblemSetList?page=${page}`;
    return this.http.get(url);
  }

  getSubscribedUsersProblemSet(page: number) {
    let url: string = `api/problemset/getSubscribedUsersProblemSet?page=${page}`;
    return this.http.get(url);
  }

  getProblemSetItem(guid: string) {
    let url: string = `api/problemset/getProblemSetItem/${guid}`;
    return this.http.get(url);
  }

  getQuestionList(value: any) {
    let url: string = `api/problemset/getQuestionList`;
    return this.http.post(url, value);
  }

  postCreateProblem(value: any) {
    let url: string = `api/problemset/postCreateProblem`;
    return this.http.post(url, value);
  }

  getSubscribeProblemSet(problemSetGuid: string) {
    let url: string = `api/problemset/getSubscribeProblemSet/${problemSetGuid}`;
    return this.http.get(url);
  }

  getUnsubscribeProblemSet(problemSetGuid: string) {
    let url: string = `api/problemset/getUnsubscribeProblemSet/${problemSetGuid}`;
    return this.http.get(url);
  }

  postSubmitAnswer(value: any){
    let url: string = `api/problemset/postSubmitAnswer`;
    return this.http.post(url, value);
  }

  getRecordPage(guid:string){
    let url: string = `api/problemset/getRecordPage/${guid}`;
    return this.http.get(url);
  }
}
