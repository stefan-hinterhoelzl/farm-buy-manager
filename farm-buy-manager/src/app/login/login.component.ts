import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  form: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthService, private snackbar: SnackbarComponent) { 
    this.form = this.fb.group({
      username: this.username,
      password: this.password
    });
  }

  ngOnInit(): void {
  }


  getErrorMessage() {
    if (this.username.hasError('required') || this.password.hasError('required')) {
      return "Nicht alle Pflichtfelder wurden ausgefüllt!"
    }
    return "";
  }

  login() {
    if (this.username.value == "" || this.password.value == "") {
      this.snackbar.openSnackBar("Nicht alle Felder wurden ausgefüllt", "red-snackbar")
    } else {
      this.auth.login((this.username.value).toLowerCase(), (this.password.value))
    }
  }

}
