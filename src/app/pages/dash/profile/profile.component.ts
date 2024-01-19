import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../services/http/authService';
import {HttpService} from '../../../services/http/httpservice';
import {MatDialog} from '@angular/material/dialog';
import {PayinDialogComponent} from './dialogs/payin-dialog.component';
import {PayoutDialogComponent} from './dialogs/payout-dialog.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProfileComponent implements OnInit {

  static ADVERTISER_TYPE_INDIVIDUAL = 'individual';
  static ADVERTISER_TYPE_BUSINESS = 'business';
  static BUSINESS_TYPE_AGENCY = 'agency';
  static BUSINESS_TYPE_BRAND = 'brand';

  @Output() updateUserEmitter: EventEmitter<any> = new EventEmitter();

  private _passwordsValidators = {
    password: [Validators.minLength(8)],
    password_new: [Validators.minLength(8)],
    password_new_confirmation: []
  };


  form: FormGroup;
  messages: any;

  changePassword = false;

  advertiserType: string;

  businessType: string;

  image: any;


  ELEMENT_DATA: any[] = [
    {
      id: 1,
      date: '09/10/2020 15:55',
      amount: 10,
      direction: 'IN',
      type: 'Wallet transfer',
      description: `Bonus di benvenuto`
    },
    {
      id: 2,
      date: '11/10/2020 18:30',
      amount: -150,
      direction: 'OUT',
      type: 'Bank transfer',
      description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
    },
  ];

  dataSource = this.ELEMENT_DATA;
  columnsToDisplay = ['id', 'date', 'amount', 'direction', 'type'];
  expandedElement: any | null;

  pcp = 0;


  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public payinDialog: MatDialog,
    public payoutDialog: MatDialog
  ) {
    this.messages = {
      required: ['Il campo {attribute} è obbligatorio'],
      minlength: ['Lunghezza troppo corta'],
      email: ['<b>{value}</b> non è un indirizzo email valido'],
      mismatch: ['Le due password non coincidono'],
      request: []
    };
  }

  ngOnInit(): void {
    this.http.title = 'Profilo';
    const user = this.auth.getUser();
    this.form = this.formBuilder.group({
      name: [user.name, [Validators.required, Validators.minLength(3)]],
      email: [user.email, [Validators.required, Validators.email]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_new: ['', [Validators.required, Validators.minLength(8)]],
        password_new_confirmation: ['', [Validators.required]],
      }, {
        updateOn: 'change'
      }),
    }, {
      validators: this.passwordMatch,
      updateOn: 'blur'
    });
    this.hidePasswordFields();
    this.getData();
  }

  passwordMatch(g?: FormGroup) {
    const passwords: any = g.controls.passwords;
    let valid = null;
    if (g && g.controls && passwords.controls.password_new && passwords.controls.password_new_confirmation) {
      let errors = passwords.controls.password_new_confirmation.errors;
      if (errors === null) {
        errors = {};
      }
      if (String(passwords.controls.password_new.value) !== String(passwords.controls.password_new_confirmation.value)) {
        valid = {mismatch: true};
        errors.mismatch = true;
        passwords.controls.password_new_confirmation.setErrors(errors);
      } else {
        if (errors.mismatch) {
          delete errors.mismatch;
        }
        errors = Object.keys(errors).length === 0 && errors.constructor === Object ? null : errors;
        passwords.controls.password_new_confirmation.setErrors(errors);
      }
    }
    return valid;
  }

  get f() {
    return this.form.controls;
  }

  get fc() {
    const passwords: any = this.form.controls.passwords;
    return passwords.controls;
  }

  showPasswordFields() {
    let validators;
    for (const i in this._passwordsValidators) {
      validators = this._passwordsValidators[i];
      validators.push(Validators.required);
      this.form.controls.passwords.get(i).reset();
      this.form.controls.passwords.get(i).setValidators(validators);
      this.form.controls.passwords.get(i).updateValueAndValidity();
    }
    this.changePassword = true;
  }

  hidePasswordFields() {
    for (const i in this._passwordsValidators) {
      this.form.controls.passwords.get(i).reset();
      this.form.controls.passwords.get(i).clearValidators();
      this.form.controls.passwords.get(i).updateValueAndValidity();
    }
    this.changePassword = false;
  }

  getData() {
    const user = this.auth.getUser();
    this.http.getAdvertiserMe().subscribe((response: any) => {
      const data: any = response.body.data;
      this.setForm(data);
    }, () => {
    });
  }

  setForm(data: any) {
    this.pcp = data.profile_completion_percentage;
    this.image = data.user.image;
    switch (data.type) {
      case ProfileComponent.ADVERTISER_TYPE_INDIVIDUAL:
        this.advertiserType = ProfileComponent.ADVERTISER_TYPE_INDIVIDUAL;
        break;
      case ProfileComponent.ADVERTISER_TYPE_BUSINESS:
        this.advertiserType = ProfileComponent.ADVERTISER_TYPE_BUSINESS;
        break;
      case ProfileComponent.BUSINESS_TYPE_AGENCY:
        this.advertiserType = ProfileComponent.ADVERTISER_TYPE_BUSINESS;
        this.businessType = ProfileComponent.BUSINESS_TYPE_AGENCY;
        break;
      case ProfileComponent.BUSINESS_TYPE_BRAND:
        this.advertiserType = ProfileComponent.ADVERTISER_TYPE_BUSINESS;
        this.businessType = ProfileComponent.BUSINESS_TYPE_BRAND;
        break;
    }
  }

  updatePersonalInfo(form, formDirective: FormGroupDirective) {
    const user = this.auth.getUser();
    const model: any = {
      id: user.id
    };
    const name = this.form.get('name').value;
    if (name !== '') {
      model.name = this.form.get('name').value;
    }
    if (this.changePassword) {
      model.password = this.form.get('passwords').get('password').value;
      model.password_new = this.form.get('passwords').get('password_new').value;
      model.password_new_confirmation = this.form.get('passwords').get('password_new_confirmation').value;
    }
    if (this.advertiserType) {
      model.advertiser_type = this.advertiserType === 'business' && this.businessType ? this.businessType : this.advertiserType;
    }
    this.http.updateAdvertiserMe(model).subscribe((response: any) => {
      const data = response.body.data;
      if (name !== '') {
        this.updateUser({name});
      }
      this.form.get('passwords').reset();
      console.log(this.form.controls.passwords.errors);
      const formValue = this.form.value;
      formDirective.resetForm();
      this.form.reset(formValue);
      this.setForm(data);
      this._snackBar.open('Aggiornamento effettuato', 'chiudi', {duration: 2000});
    }, () => {
      this._snackBar.open('Errore in fase di salvataggio', 'chiudi', {
        duration: 2000
      });
    });
  }

  updateUser(data) {
    this.auth.updateUser(data);
    this.updateUserEmitter.emit(data);
  }

  updateUserImage($event) {
    this.updateUser({
      image: {
        url: $event.file.url
      }
    });
  }

  clearUserImage($event) {
    this.updateUser({image: null});
  }

  payin() {
    const dialogRef = this.payinDialog.open(PayinDialogComponent, {
      // height: '600px',
      maxWidth: '800px',
      data: {}
    });
  }

  payout() {
    const dialogRef = this.payinDialog.open(PayoutDialogComponent, {
      // height: '600px',
      width: '800px',
      data: {}
    });
  }
}
