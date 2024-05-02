import { Component, OnInit } from '@angular/core';
import { ProblemSetServiceApiService } from 'src/app/@services-api/problem-set-service-api.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit{
  getSubscribedUsersProblemSetValue:any;
  textValue: string = "";
  currentPage:number=1;
  maxPage:number=1;
  constructor(private problemSetServiceApiService:ProblemSetServiceApiService,private sweetalertService: SweetalertService){}

  ngOnInit(): void {
      this.problemSetServiceApiService.getSubscribedUsersProblemSet(1).subscribe((data:any)=>{
        this.getSubscribedUsersProblemSetValue=data.data;
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
            this.getSubscribedUsersProblemSetValue = data.data;
            this.maxPage=data.maxPage;
            this.currentPage=page;
          }, 300);
        })
      }
    });
  }
}
