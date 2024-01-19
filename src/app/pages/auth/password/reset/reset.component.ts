import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../services/http/authService';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  form: FormGroup;
  token: string;
  email: string;
  sent: boolean;
  messages: any;


  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

    this.messages = {
      required: ['Il campo {attribute} è obbligatorio'],
      minlength: ['Lunghezza troppo corta'],
      pattern: ['Le due password non coincidono'],
      request: []
    };
  }

  ngOnInit(): void {
    this.sent = false;
    this.route.params.subscribe((params: any) => {
      this.token = params.token;
      this.form = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]],
      }, {
        updateOn: 'blur',
      });
    });
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  get f() { return this.form.controls; }

  reset() {
    const data = {
      token: this.token,
      email: this.email,
      password: this.form.get('password').value,
      password_confirmation: this.form.get('password_confirmation').value
    };
    const self = this;
    this.auth.passwordReset(data).subscribe(
      (result: any) => {
        this.sent = true;
        setTimeout(function() {
          self.router.navigate(["auth/login"], {state: {data: { email: self.email }}});
        }, 5000);
      }, (error) => {
        this.form.controls['password'].setErrors({'request': true});
        this.form.controls['password'].markAsTouched();
        this.messages.request = error.error.errors && error.error.errors.email ? error.error.errors.email : [];
      }
    );
  }
}
