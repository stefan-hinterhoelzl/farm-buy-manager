import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { take } from 'rxjs';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'farm-buy-manager';

  isloggedIn: boolean = false;

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {
    this.authStautsListener()

  }
  authStautsListener() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isloggedIn = true;
      } else {
        this.isloggedIn = false;
      }
    });
  }

  logout() {
    this.auth.logout()
  }

  openChangePasswordDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "300px"
    dialogConfig.width = "500px"
    dialogConfig.minWidth = "500px"
    dialogConfig.minHeight = "300px"

    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data != null) {
        this.auth.changePassword(data);
      }
    }); 
  }
}
