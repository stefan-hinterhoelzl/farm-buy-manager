import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { getAuth } from '@firebase/auth';
import { serverTimestamp } from '@firebase/firestore';
import { Investment, Ranking } from 'src/app/models/investment.model';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

@Component({
  selector: 'app-add-investment-dialog',
  templateUrl: './add-investment-dialog.component.html',
  styleUrls: ['./add-investment-dialog.component.scss']
})
export class AddInvestmentDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddInvestmentDialogComponent>, private fb: FormBuilder, private snackbar: SnackbarComponent) {
    this.form = this.fb.group({
      item: this.item,
      price: this.price
    })
   }

  item = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.required]);
  form: FormGroup

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  add() {
    if (this.item.value != "" && this.price.value != "") {
      const auth = getAuth()

      const investment = <Investment> {
        item: this.item.value,
        price: this.price.value,
        createdBy: auth.currentUser?.email?.substring(0, auth.currentUser.email.indexOf('@')),
        createdAt: serverTimestamp(),
        points: 0,
        bought: false,
      }
      this.dialogRef.close(investment);
    } else {
      this.snackbar.openSnackBar("Nicht alle Felder wurden ausgefüllt.", "red-snackbar");
    }
  }

}
