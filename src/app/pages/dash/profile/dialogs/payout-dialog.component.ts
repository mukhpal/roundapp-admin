import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-payout-dialog',
  templateUrl: 'payout-dialog.component.html',
  // styleUrls: ['.payout-dialog.component.scss']
})
export class PayoutDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  abort(): void {
    this.dialogRef.close(false);
  }

}
