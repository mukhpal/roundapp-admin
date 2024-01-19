import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpService} from "../../../../services/http/httpservice";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {concatMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-payin-dialog',
  templateUrl: 'payin-dialog.component.html',
  styleUrls: ['payin-dialog.component.scss']
})
export class PayinDialogComponent implements OnInit {

  displayedColumns = ['payment_type', 'date', 'amount'];
  dataSource = [
    {payment_type: 'Bonifico bancario', date: '10/08/2020', amount: 150},
    {payment_type: 'Carta di credito', date: '19/08/2020', amount: 22},
  ];

  paymentOptions = [
    {id: 1, description: 'Bonifico bancario su IT00058******0000 intestato a Pinco Pallino'},
    {id: 2, description: 'Carta di credito 5342 **** **** 4123 intestata a Mickey Mouse'},
    {id: 0, description: 'Altro'}
  ];

  newPaymentOptions = [
    {type: 'bon', description: 'Bonifico bancario'},
    {type: 'cc', description: 'Carta di credito'}
  ];

  form: FormGroup;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PayinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cardNumber: ['', [Validators.required]],
      cardExpirationDate: ['', [Validators.required]],
      cardCvx: ['', [Validators.required]]
    }, {
      updateOn: 'blur'
    });
  }

  payin() {
    let cardRegistration: any;
    let dataConfirmCard: any;
    const cardData = {
      number: this.form.get('cardNumber').value,
      expirationDate: '1220', // this.form.get('cardExpirationDate').value
      cvx: this.form.get('cardCvx').value
    };
    this.http.registerCard().pipe(
      tap((response: any)  => { cardRegistration = response.body; }),
      concatMap(res => this.http.sendCardInfo(cardRegistration, cardData)),
      tap((response: any)  => { dataConfirmCard = response.body; }),
      concatMap(res => this.http.confirmCard(cardRegistration.uuid, res.body)),
      tap((response: any)  => console.log(response)),
    ).subscribe((response: any) => {
      console.log(response);
    });
  }

  registerCard() {
    return this.http.registerCard().subscribe((response: any) => {
      const cardRegistration: any = response.body;
      const cardData = {
        number: this.form.get('cardNumber').value,
        expirationDate: '1220', // this.form.get('cardExpirationDate').value
        cvx: this.form.get('cardCvx').value
      };
    }, () => {});
  }

  confirmCard(cardRegistration, cardData) {
    /*
    const url = cardRegistration.url;
    this.http.confirmCard(cardRegistration, cardData).subscribe((response: any) => {
      console.log(response);
    }, () => {});
    */
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  abort(): void {
    this.dialogRef.close(false);
  }

}
