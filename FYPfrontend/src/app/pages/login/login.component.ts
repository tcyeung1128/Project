import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPost } from 'src/app/@models/login.model';
import { AuthorizationServiceApiService } from 'src/app/@services-api/authorization-service-api.service';
import { SweetalertService } from 'src/app/@services/sweetalert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginValue: LoginPost = {
    user_account: '',
    user_password: ''
  };

  constructor(private authorizationServiceApiService: AuthorizationServiceApiService, private router: Router, private sweetalertService: SweetalertService) {

  }

  ngOnInit(): void {

  }

  login() {
    this.authorizationServiceApiService.jwtLogin(this.loginValue).subscribe((data: any) => {
      if (data) {
        console.log("??")
        localStorage.setItem('jwt', data.token);
        this.router.navigateByUrl('/home/homepage');
      } else {
        //this.sweetalertService.dialog("Login fail.")
      }
    });
  }

}
