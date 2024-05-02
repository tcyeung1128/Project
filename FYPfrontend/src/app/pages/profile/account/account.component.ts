import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePassword } from 'src/app/@models/login.model';
import { AuthorizationServiceApiService } from 'src/app/@services-api/authorization-service-api.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  modifyValue: ChangePassword = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(private authorizationServiceApiService: AuthorizationServiceApiService, private router: Router, private sweetalertService: SweetalertService) {

  }

  ngOnInit(): void {

  }

  modifyAccount() {
    this.authorizationServiceApiService.modifyAccount(this.modifyValue).subscribe((data: any) => {
      if (data) {
        localStorage.setItem('jwt', data.token);
        this.sweetalertService.dialog("Password successfully changed.");
        this.modifyValue = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }
      }
    });
  }
}
