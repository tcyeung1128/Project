import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPost } from 'src/app/@models/login.model';
import { AuthorizationServiceApiService } from 'src/app/@services-api/authorization-service-api.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  loginValue: LoginPost = {
    user_account: '',
    user_password: ''
  };

  constructor(private authorizationServiceApiService: AuthorizationServiceApiService, private router: Router, private sweetalertService: SweetalertService) {

  }

  ngOnInit(): void {

  }

  createAccount() {
    this.authorizationServiceApiService.createAccount(this.loginValue).subscribe((data: any) => {
      if (data) {
        localStorage.setItem('jwt', data.token);
        this.router.navigateByUrl('/home/homepage');
      } else {
        //this.sweetalertService.dialog("Login fail.")
      }
    });
  }

}
