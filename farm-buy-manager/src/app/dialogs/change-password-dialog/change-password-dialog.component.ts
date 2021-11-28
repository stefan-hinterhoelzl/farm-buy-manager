import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ChangePasswordDialogComponent>, private fb: FormBuilder, private snackbar: SnackbarComponent) {
    this.form = this.fb.group({
      newpassword: this.newpassword,
      newpasswordcheck: this.newpasswordcheck
    })
   }

  newpassword = new FormControl('', [Validators.required]);
  newpasswordcheck = new FormControl('', [Validators.required]);
  form: FormGroup

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.newpassword.value === this.newpassword.value && this.newpassword.value != "") {
      this.dialogRef.close(this.newpassword.value);
    }
    else{
      this.snackbar.openSnackBar("Passwörter stimmen nicht überein oder sind leer.", "red-snackbar")
    }
  }

}
