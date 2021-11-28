import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithEmailAndPassword, signOut, updatePassword, User} from "firebase/auth";
import { BehaviorSubject } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private snackbar: SnackbarComponent, private router: Router) { }

  login(username: string, password: string) {
    username = username+"@farmlife.at";

    const auth = getAuth();

    signInWithEmailAndPassword(auth, username, password).then((result) => {
      let snackbarRef = this.snackbar.openSnackBar("Eingeloggt!", "green-snackbar");
      this.router.navigate(["/app"]);
    }).catch((error) => {
      let snackbarRef = this.snackbar.openSnackBar(error, "red-snackbar");
    });
  }


  logout() {
    const auth = getAuth();
    signOut(auth).then((value) => {
      this.router.navigate(["/login"])
      this.snackbar.openSnackBar("Abgemeldet!", "green-snackbar");
    }).catch((error) => {
      this.snackbar.openSnackBar("Ausloggen fehlgeschlagen", "red-snackbar");
    })
  }

  changePassword(newPassword: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user != null) {
      updatePassword(user, newPassword).then(() => {
        this.snackbar.openSnackBar("Passwort erfolgreich geändert!", "green-snackbar")
      }).catch((error) => {
        this.snackbar.openSnackBar("Fehler beim Ändern des Passwortes! - Loggen Sie sich nochmal aus und ein.", "red-snackbar")
      });
    }
    
  }
}
