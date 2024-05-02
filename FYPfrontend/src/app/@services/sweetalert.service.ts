import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ProblemSetServiceApiService } from '../@services-api/problem-set-service-api.service';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {
  public readonly swal: any = Swal;

  constructor(private router: Router) { }

  dialog(text: string) {
    Swal.fire({
      background: '#fff',
      confirmButtonColor: '#3a456d',
      titleText: text,
      //icon: 'success',
      confirmButtonText: 'OK'
    })
  }

  onSuccessfulActionNavigate(patch: string) {
    Swal.fire({
      background: '#fff',
      confirmButtonColor: '#3a456d',
      text: 'success',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.router.navig
        this.router.navigate([patch]);
      }
    });
  }

  answerProblemSetError(patch: string) {
    Swal.fire({
      background: '#fff',
      confirmButtonColor: '#3a456d',
      text: 'Cannot find the problem set.',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.router.navig
        this.router.navigate([patch]);
      }
    });
  }
}
