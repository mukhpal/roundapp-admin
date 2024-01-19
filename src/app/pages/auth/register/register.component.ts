import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/http/authService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
      minlength: ['Lunghezza troppo corta'],
      email: ['<b>{value}</b> non è un indirizzo email valido'],
      pattern: ['Le due password non coincidono'],
      request: []
    };
  }

  ngOnInit(): void {
    this.sent = false;
    this.route.params.subscribe((params: any) => {
      this.form = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]],
      }, {
        updateOn: 'blur'
      });
    });
  }

  get f() { return this.form.controls; }

  register() {
    const name = this.form.get('name').value;
    const email = this.form.get('email').value;
    const data = {
      name,
      email,
      password: this.form.get('password').value,
      password_confirmation: this.form.get('password_confirmation').value
    };
    this.auth.register(data).subscribe(
      (response: any) => {
        let user: any = {};
        user = Object.assign({ name, email }, response.body);
        // user.username = data.email.split('@')[0];
        this.auth.setUser(user, 1);

        // this.auth.isAuthenticate(obj);
        this.router.navigate(['/auth/verify']);
      }, (error) => {
        console.error(error);
        this.form.controls['email'].setErrors({ 'request': true });
        this.form.controls['email'].markAsTouched();
        this.messages.request = error.error.errors && error.error.errors.email ? error.error.errors.email : [];
      });
  }
}
