import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebServiceApiService {
  constructor(private http:HttpClient) { }

    getLatestUpdatedProblemSet(page:number){
      let url:string=`api/web/LatestUpdatedProblemSet?page=${page}`;
      return this.http.get(url);
    };

    getSearchForSpecificProblemSet(page:number,text:string){
      let url:string=`api/web/searchForSpecificProblemSet?page=${page}&text=${text}`;
      return this.http.get(url);
    };
  
}
