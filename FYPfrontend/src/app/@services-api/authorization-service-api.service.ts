import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangePassword, LoginPost } from '../@models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationServiceApiService {

  constructor(private http: HttpClient) { }

  jwtLogin(value: LoginPost) {
    let url: string = "api/authorization/login";
    return this.http.post(url, value);
  }

  createAccount(value: LoginPost) {
    let url: string = "api/user/createaccount";
    return this.http.post(url, value);
  }

  modifyAccount(value:ChangePassword){
    let url: string = "api/user/useVerifyToken/modifyAccount";
    return this.http.post(url, value);
  }
}