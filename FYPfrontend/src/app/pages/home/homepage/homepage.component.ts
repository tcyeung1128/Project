import { WebServiceApiService } from 'src/app/@services-api/web-service-api.service';
import { Component, OnInit } from '@angular/core';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

export class HomepageComponent implements OnInit {
  getLatestUpdatedProblemSetValue: any;
  textValue: string = "";
  searchTextValue: string = "";
  currentPage: number = 1;
  maxPage: number = 1;
  constructor(private webServiceApiService: WebServiceApiService, private sweetalertService: SweetalertService) { }

  ngOnInit(): void {
    this.webServiceApiService.getLatestUpdatedProblemSet(1).subscribe((data: any) => {
      console.log('test')
      console.log(data)
      this.getLatestUpdatedProblemSetValue = data.data;
      this.maxPage = data.maxPage;
    });
  }

  searchButton() {
    console.warn(this.textValue)
    this.searchTextValue = this.textValue;

    this.sweetalertService.swal.fire({
      text: "loading!",
      allowOutsideClick: false,
      didOpen: () => {
        this.sweetalertService.swal.showLoading();
        this.webServiceApiService.getSearchForSpecificProblemSet(1, this.searchTextValue).subscribe((data: any) => {
          setTimeout(() => {
            this.sweetalertService.swal.close();
            console.log(data)
            this.getLatestUpdatedProblemSetValue = data.data;
            this.maxPage = data.maxPage;
            this.currentPage = 1;
          }, 300);
        })
      }
    });
  }

  changePage(page: number) {
    console.log(page);
    this.textValue = this.searchTextValue;
    
    this.sweetalertService.swal.fire({
      text: "loading!",
      allowOutsideClick: false,
      didOpen: () => {
        this.sweetalertService.swal.showLoading();
        this.webServiceApiService.getSearchForSpecificProblemSet(page, this.searchTextValue).subscribe((data: any) => {
          setTimeout(() => {
            this.sweetalertService.swal.close();
            console.log(data)
            this.getLatestUpdatedProblemSetValue = data.data;
            this.maxPage = data.maxPage;
            this.currentPage = page;
          }, 300);
        })
      }
    });
  }
}