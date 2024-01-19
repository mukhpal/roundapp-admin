import {ActivatedRoute, NavigationEnd, RoutesRecognized} from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/http/authService';
import {RoutingState} from '../../../services/http/routingState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  messages: any;
  email = '';
  redirectUrl = environment.accessUrl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private routingState: RoutingState
  ) {
    this.messages = {
      required: ['Il campo {attribute} è obbligatorio'],
      email: ['<b>{value}</b> non è un indirizzo email valido'],
      request: []
    };
  }

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      const email = history.state.data && history.state.data.email ? history.state.data.email : '';
      this.form = this.formBuilder.group({
        email: [email, [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        remember: ['']
      }, {
        updateOn: 'change'
      });
    });
  }

  get f() { return this.form.controls; }

  login() {
    const email = this.form.get('email').value;
    const remember = this.form.get('remember').value === '' ? 0 : 1;
    const credentials = {
      email,
      password: this.form.get('password').value,
      remember,
    };
    this.auth.login(credentials).subscribe(
      (response: any) => {
        let data: any = {};
        data = Object.assign({
          email
        }, response.body);
        console.log(data);
        this.auth.setUser(data, remember);

        const previousUrl = this.routingState.getPreviousUrl();
        if (previousUrl && !previousUrl.match(/^\/?auth.*$/) && !previousUrl.match(/^\/?index.*$/)) {
          try {
            this.router.navigateByUrl(previousUrl);
          }
          catch (e) {
            this.router.navigate([this.redirectUrl]);
          }
        }
        else {
          this.router.navigate([this.redirectUrl]);
        }
        // this.auth.redirectBack('myVideo');
        /*
        if (this.auth.isVerified()) {
          this.auth.redirectBack('myVideo');
          // this.router.navigate(['/myVideo']);
        } else {
          this.router.navigate(['auth/verify']);
        }
        */
      }, error => {
        // Reset password field
        this.form.controls['password'].setValue('');
        this.form.controls['email'].setErrors({'request': true});
        this.form.controls['email'].markAsTouched();
        this.messages.request = ['Credenziali non valide'];
      });
  }
}
