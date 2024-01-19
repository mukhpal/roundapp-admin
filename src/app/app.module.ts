import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/http/authService';
import { AuthGuard } from './services/http/authGuard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './services/http/interceptor';
import { DashModule } from './pages/dash/dash.module';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AppMaterialModule } from './app-material.module';
import { LoginComponent } from './pages/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerService } from './services/spinner/spinnerService';
import { BlockUIModule } from 'ng-block-ui';
import { HttpService } from './services/http/httpservice';
import { RoutingState } from './services/http/routingState';
import { ToastrModule } from 'ngx-toastr';
import { ForgotComponent } from './pages/auth/password/forgot/forgot.component';
import { ResetComponent } from './pages/auth/password/reset/reset.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { SiteComponent } from './pages/site/site.component';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {UploaderModule} from '@syncfusion/ej2-angular-inputs';
import {MatTabsModule} from '@angular/material/tabs';

registerLocaleData(localeIt, 'it');

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    ForgotComponent,
    ResetComponent,
    RegisterComponent,
    VerifyComponent,
    SiteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    DashModule,
    NgxMaskModule.forRoot(maskConfig),
    BlockUIModule.forRoot({
      template: SpinnerComponent,
      message: 'Loading...'
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    UploaderModule,
    MatTabsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'it-IT'},
    SpinnerService,
    HttpService,
    RoutingState
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare);
  }
 }
