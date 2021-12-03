import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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


  constructor(private dialogRef: MatDialogRef<AddInvestmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private snackbar: SnackbarComponent) {
    this.form = this.fb.group({
      item: this.item,
      price: this.price
    });
    
   }

  item = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.required]);
  form: FormGroup

  ngOnInit(): void {
    if (this.data != null) {
      this.item.setValue(this.data.investment.item);
      this.price.setValue(this.data.investment.price);
    }
  }

  close() {
    this.dialogRef.close();
  }

  add() {
    if (this.item.value != "" && this.price.value != "") {
      this.data.investment.price = this.price.value;
      this.data.investment.item = this.item.value;

      this.dialogRef.close(this.data.investment);
    } else {
      this.snackbar.openSnackBar("Nicht alle Felder wurden ausgefüllt.", "red-snackbar");
    }
  }

}
