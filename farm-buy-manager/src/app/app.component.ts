import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'farm-buy-manager';

  isloggedIn: boolean = false;
  isMobileLayout: boolean = false;

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {
    this.authStautsListener()

  }
  ngOnInit(): void {
    
    if(window.screen.width <=1300) this.isMobileLayout = true;

    //Check for screen size
    window.onresize = () => {
      console.log("Hello")
      this.isMobileLayout = window.innerWidth <= 1300;
  }
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

    if (!this.isMobileLayout) {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      //dialogConfig.height = "33%"
      dialogConfig.width = "40%"
      dialogConfig.minWidth = "40%"
      //dialogConfig.minHeight = "33%"
    } else {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      //dialogConfig.height = "45%"
      dialogConfig.width = "95%"
      dialogConfig.minWidth = "95%"
      //dialogConfig.minHeight = "45%"
    }

    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data != null) {
        this.auth.changePassword(data);
      }
    }); 
  }
}
