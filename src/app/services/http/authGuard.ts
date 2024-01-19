import { AuthService } from './authService';
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private auth: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requireVerification = route.data && typeof route.data.requireVerification !== 'undefined' ? route.data.requireVerification : true;
    const user = this.auth.getUser();
    let can = false;
    if (!this.auth.isGuest()) {
      if (requireVerification === true && !user.verified) {
        this.router.navigate(['/auth/verify']);
      }
      can = true;
    }
    else {
      this.router.navigate(['/auth/login']);
    }
    return can;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
