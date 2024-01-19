import { AuthService } from './authService';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinnerService';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private auth: AuthService,
    private spinner: SpinnerService,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const wait = Number(request.headers.get('X-Spinner') ?? '1');
    if (wait) {
      this.spinner.start();
    }
    const user = this.auth.getUser();
    if (!this.auth.isGuest() && user && user.access_token && request.url.startsWith(environment.urlBase)) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + user.access_token)
      });
    }
    return next.handle(request).pipe(
      finalize(() => this.spinner.stop()),
      catchError((error: HttpErrorResponse) => {
      this.spinner.stop();
      if (error.status === 500) {
        if (error && error.error && typeof error.error === 'string') {
          this.toastr.error(error.error);
        }
        if (error && error.error && typeof error.error === 'object') {
          const errors = error.error.title ? error.error.title : error.error.Message;
          this.toastr.error(errors);
        }
        /* if (error.error && error.error.Message) {
          this.toast.showError(error.error.Message);
        }  */
        if (error && !error.error) {
          this.toastr.error('Server Error');
        }
      }
      if (error.status === 401) {
        /*
        this.toastr.error('Not Authorized');
        this.auth.clearUser();
        this.router.navigate(['/auth/login']);
        */
      }
      if (error.status === 400 && typeof error.error.errors === 'object') {
        let errorKeys = Object.keys(error.error.errors);
        let errorMessage = '';
        if (errorKeys.length > 0) {
          errorKeys.forEach((message: string) => {
            error.error.errors[message].forEach((item: string) => {
              errorMessage += item + '\n';
            });
          });
        }
        if (errorMessage) {
          this.toastr.error(errorMessage);
        } else {
          this.toastr.error('Error 400');
        }
      }

        return throwError(error);
    }));
  }
}
