import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {Router, RoutesRecognized} from '@angular/router';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../spinner/spinnerService';
import {filter, map, pairwise} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import {User} from "../../models/user";

@Injectable()
export class AuthService {

  private url: string = environment.urlBase;

  constructor(private router: Router, private http: HttpClient, spinner: SpinnerService) {
  }

  login(obj) {
    return this.http.post(this.url + 'auth/login', obj, { observe: 'response' }).pipe(map((result: any) => {
     /*  this.spinner.stop(); */
      return result;
    }));
  }
  logout() {
    return this.http.post(this.url + 'auth/logout', {}, { observe: 'response' }).pipe(map((result: any) => {
      this.clearUser();
      this.router.navigate(['/auth/login']);
      return result;
    }, (error) => {
      this.clearUser();
      this.router.navigate(['/auth/login']);
    }));
  }

  register(obj) {
    return this.http.post(this.url + 'auth/register/advertiser', obj, { observe: 'response' }).pipe(map((result: any) => {
      /* this.spinner.stop(); */
      return result;
    }));
  }
  verify(data: any) {
    let params = new HttpParams();
    params = params.append('expires', data.expires);
    params = params.append('signature', data.signature);
    return this.http.get(this.url + 'auth/email/verify/' + data.id + '/' + data.hash,
      { params, observe: 'response' }).pipe(map((result: any) => {
     /*  this.spinner.stop(); */
      return result;
    }));
  }
  resend() {
    return this.http.get(this.url + 'auth/email/resend', { observe: 'response' }).pipe(map((result: any) => {
      /* this.spinner.stop(); */
      return result;
    }));
  }
  passwordForgot(data){
    return this.http.post(this.url + 'auth/password/forgot', data, { observe: 'response' }).pipe(map((result: any) => {
      return result;
    }));
  }

  /**
   * @param data: {
   *   token
   *   email
   *   password
   *   password_confirmation
   * }
   */
  passwordReset(data){
    return this.http.post(this.url + 'auth/password/reset', data, { observe: 'response' }).pipe(map((result: any) => {
      return result;
    }));
  }

  getRememberUser() {
    const item = localStorage.getItem('RememberUser');
    return item !== null ? Number(item) : 0;
  }

  setRememberUser(remember) {
    localStorage.setItem('RememberUser', remember);
  }

  setUser(user: any, remember?: number) {
    let r;
    if (!remember) {
      r = this.getRememberUser();
    }
    else {
      r = remember;
      this.setRememberUser(remember);
    }
    this.clearUser();
    if (r) {
      localStorage.setItem('User', JSON.stringify(user));
    }
    else {
      sessionStorage.setItem('User', JSON.stringify(user));
    }
    return user;
  }

  updateUser(data: any) {
    const user = this.getUser();
    return this.setUser(Object.assign({}, user, data));
  }

  getUser() {
    let item;
    let user;
    if (this.getRememberUser()) {
      item = localStorage.getItem('User');
      user = item ? JSON.parse(item) : null;
    }
    else {
      item = sessionStorage.getItem('User');
      user = item ? JSON.parse(item) : null;
    }
    return user as User;
  }

  clearUser() {
    localStorage.removeItem('User');
    sessionStorage.removeItem('User');
  }

  isGuest() {
    const isTokenExpired = this.isTokenExpired();
    return isTokenExpired === true || isTokenExpired == null;
  }

  isAdmin() {
    const user = this.getUser();
    return user.role === 'admin';
  }

  isVerified() {
    const user = this.getUser();
    return user && user.verified;
  }

  markAsVerified() {
    this.updateUser({ verified: true});
  }

  isTokenExpired() {
    const jwtHelper = new JwtHelperService ();
    const user = this.getUser();
    const token = user && user.access_token ? user.access_token : null;
    return token ? jwtHelper.isTokenExpired(token) : null;
  }
}
