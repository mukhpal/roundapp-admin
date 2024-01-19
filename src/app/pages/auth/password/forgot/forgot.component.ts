import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../services/http/authService';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  form: FormGroup;
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
      email: ['<b>{value}</b> non è un indirizzo email valido'],
      request: []
    };
  }

  ngOnInit(): void {
    this.sent = false;
    this.route.params.subscribe((params: any) => {
      const email = history.state.data && history.state.data.email ? history.state.data.email : '';
      this.form = this.formBuilder.group({
        email: [email, [Validators.required, Validators.email]]
      }, {
        updateOn: 'blur'
      });
    });
  }

  get f() { return this.form.controls; }

  forgot() {
    const data = {
      email: this.form.get('email').value
    };
    this.auth.passwordForgot(data).subscribe(
      (result: any) => {
        this.sent = true;
      }, (error) => {
        console.error(error);
        this.form.controls['email'].setErrors({'request': true});
        this.form.controls['email'].markAsTouched();
        this.messages.request = error.error.errors && error.error.errors.email ? error.error.errors.email : [];
      }
    );
  }
}
