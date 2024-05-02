import { ProblemSetServiceApiService } from 'src/app/@services-api/problem-set-service-api.service';
import { Component, OnInit } from '@angular/core';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-my-problem-set',
  templateUrl: './my-problem-set.component.html',
  styleUrls: ['./my-problem-set.component.scss']
})
export class MyProblemSetComponent implements OnInit{
  getMyProblemSetListValue:any;
  textValue: string = "";
  currentPage:number=1;
  maxPage:number=1;
  constructor(private problemSetServiceApiService:ProblemSetServiceApiService,private sweetalertService: SweetalertService){}

  ngOnInit(): void {
      this.problemSetServiceApiService.getMyProblemSetList(1).subscribe((data:any)=>{
        this.getMyProblemSetListValue=data.data;
        this.maxPage=data.maxPage;
      });
  }

  changePage(page:number){
    console.log(page);
    this.sweetalertService.swal.fire({
      text: "loading!",
      allowOutsideClick: false,
      didOpen: () => {
        this.sweetalertService.swal.showLoading();
        this.problemSetServiceApiService.getMyProblemSetList(page).subscribe((data: any) => {
          setTimeout(() => {
            this.sweetalertService.swal.close();
            console.log(data)
            this.getMyProblemSetListValue = data.data;
            this.maxPage=data.maxPage;
            this.currentPage=page;
          }, 300);
        })
      }
    });
  }
}
