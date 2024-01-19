import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router, RoutesRecognized} from '@angular/router';
import { AuthGuard } from './services/http/authGuard';
import {GuestGuard} from './services/http/guestGuard';
import { LoginComponent } from './pages/auth/login/login.component';
import {ForgotComponent} from './pages/auth/password/forgot/forgot.component';
import {ResetComponent} from './pages/auth/password/reset/reset.component';
import {RegisterComponent} from './pages/auth/register/register.component';
import {VerifyComponent} from './pages/auth/verify/verify.component';
import {SiteComponent} from './pages/site/site.component';



const routes: Routes = [
  { path: '', component: SiteComponent },
  // {path: '', redirectTo: '/dash/index'},
  // { path: 'dash', component: DashComponent,
  /*
    loadChildren: () => import('./pages/dash/dash.module').then(m => m.DashModule),
      canActivateChild: [AuthGuard], runGuardsAndResolvers: 'always'
      */
  //   },
  { path: 'auth/password/forgot', component: ForgotComponent },
  { path: 'auth/password/reset/:token', component: ResetComponent },
  { path: 'auth/register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'auth/verify/:id/:hash', component: VerifyComponent, canActivate: [AuthGuard], data: { requireVerification: false } },
  { path: 'auth/verify', component: VerifyComponent, canActivate: [AuthGuard], data: { requireVerification: false } },
  { path: 'auth/login', component: LoginComponent, canActivate: [GuestGuard] },
  // {path: '**', redirectTo: ''}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
