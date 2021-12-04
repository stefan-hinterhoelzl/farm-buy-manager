import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { getAuth } from '@firebase/auth';
import { take } from 'rxjs';
import { AddInvestmentDialogComponent } from '../dialogs/add-investment-dialog/add-investment-dialog.component';
import { AreYouSureDialogComponent } from '../dialogs/are-you-sure-dialog/are-you-sure-dialog.component';
import { Investment, Ranking } from '../models/investment.model';
import { InvestmentsService } from '../services/investments.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private dialog: MatDialog, private firestore: InvestmentsService, private snackbar: SnackbarComponent) { }
  loading: boolean = true;
  newrankingloading: boolean = false;
  openinvestments: Investment[] = []
  openinvestmentsArrayMoving: Investment[] = []
  investionVolume: number = 0
  rankings: Ranking[] = []
  boughtinvestments: Investment[] = []
  displayedColumns: string[] = ['item', 'price', 'createdby', 'createdat', 'points', 'action1', 'action2', 'action3'];
  mobileColumns: string[] = ['item', 'price', 'points', 'action1', 'action2', 'action3'];
  displayedColumnsBought: string[] = ['item', 'price', 'createdby', 'createdat', 'action2'];
  mobileColumnsBought: string[] = ['item', 'price', 'action2'];
  isMobileLayout: boolean = false;

  ngOnInit(): void {

    const auth = getAuth();

    this.firestore.investmentStatus.subscribe(async (data) => {
      if (data != null) {
        this.investionVolume = 0;
        this.openinvestments = data.filter((value) => { return value.bought == false })
        this.openinvestments.forEach((value) => {
          this.investionVolume = this.investionVolume + value.price;
        });
        this.rankings = await this.firestore.getLastRankingPromise();
        this.boughtinvestments = data.filter((value) => { return value.bought == true })

        //Match existing Ranking with new data
        for (let i = 0; i < this.rankings.length; i++) {
          let item = this.openinvestments.find((value) => {return value.uid == this.rankings[i].item})
          //remove the element
          if (item == undefined) this.rankings.splice(i, 1);
        }

        if (this.rankings.length < this.openinvestments.length) {
          for (let i = 0; i < this.openinvestments.length; i++) {
            let item = this.rankings.find((value) => {return value.item == this.openinvestments[i].uid})
            
            if (item == undefined) {
              const ranking = <Ranking> {
                itemname: this.openinvestments[i].item,
                item: this.openinvestments[i].uid,
                points: 0,
                user: auth.currentUser != null?auth.currentUser.uid:" "
              }

              this.rankings.push(ranking);
            }
          }
        }
        this.loading = false;
      }
    });

    if (window.screen.width <= 1300) this.isMobileLayout = true;

    //Check for screen size
    window.onresize = () => this.isMobileLayout = window.innerWidth <= 1300;
  }


  openAddDialog() {
    const dialogConfig = new MatDialogConfig();

    if (!this.isMobileLayout) {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "33%"
      dialogConfig.width = "60%"
      dialogConfig.minWidth = "60%"
      dialogConfig.minHeight = "33%"
    } else {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "45%"
      dialogConfig.width = "95%"
      dialogConfig.minWidth = "95%"
      dialogConfig.minHeight = "45%"
    }


    const dialogRef = this.dialog.open(AddInvestmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data: Investment) => {
      if (data != null) {
        this.firestore.addInvestment(data).then((data) => {
          this.snackbar.openSnackBar("Investition erfolreich hinzugefügt.", "green-snackbar")
        }).catch((error) => {
          this.snackbar.openSnackBar("Fehler beim Hinzufügen des Investition.", "red-snackbar")
        });
      }
    });
  }

  editInvestment(investment: Investment) {
    const dialogConfig = new MatDialogConfig();

    if (!this.isMobileLayout) {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "33%"
      dialogConfig.width = "60%"
      dialogConfig.minWidth = "60%"
      dialogConfig.minHeight = "33%"
    } else {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "45%"
      dialogConfig.width = "95%"
      dialogConfig.minWidth = "95%"
      dialogConfig.minHeight = "45%"
    }

    dialogConfig.data = {
      investment: investment,
    }

    const dialogRef = this.dialog.open(AddInvestmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data: Investment) => {
      if (data != null) {
        this.firestore.updateInvestment(data).then((data) => {
          this.snackbar.openSnackBar("Investition erfolgreich geändert.", "green-snackbar")
        }).catch((error) => {
          this.snackbar.openSnackBar("Fehler beim Ändern der Investition.", "red-snackbar")
          console.log(error);
        });
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rankings, event.previousIndex, event.currentIndex);
  }


  saveRanking() {
    this.newrankingloading = true;
    this.firestore.saveRanking(this.rankings).then(async (data) => {
      this.snackbar.openSnackBar("Ranking gespeichert!", "green-snackbar")
      
      this.newrankingloading = false;
    });
  }

  deleteInvestment(investment: Investment) {
    const dialogConfig = new MatDialogConfig();

    if (!this.isMobileLayout) {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "20%"
      dialogConfig.width = "30%"
      dialogConfig.minWidth = "30%"
      dialogConfig.minHeight = "20%"
    } else {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "30%"
      dialogConfig.width = "95%"
      dialogConfig.minWidth = "95%"
      dialogConfig.minHeight = "30%"
    }

    dialogConfig.data = {
      title: "Sind Sie sicher, dass Sie diese Investition löschen wollen?",
      content: investment.item
    }

    const dialogRef = this.dialog.open(AreYouSureDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data: Investment) => {
      if (data) {
        this.firestore.delete(investment.uid).then(() => {
          this.snackbar.openSnackBar("Investition gelöscht.", "green-snackbar");
        }).catch((error) => {
          this.snackbar.openSnackBar("Löschen der Investition fehlgeschlagen.", "red-snackbar");
        })
      }
    });
  }

  buyInvestment(investment: Investment) {
    const dialogConfig = new MatDialogConfig();

    if (!this.isMobileLayout) {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "20%"
      dialogConfig.width = "30%"
      dialogConfig.minWidth = "30%"
      dialogConfig.minHeight = "20%"
    } else {
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = "30%"
      dialogConfig.width = "95%"
      dialogConfig.minWidth = "95%"
      dialogConfig.minHeight = "30%"
    }

    dialogConfig.data = {
      title: "Sind Sie sicher, dass Sie diese Investition auf 'gekauft' setzen wollen?",
      content: investment.item
    }

    const dialogRef = this.dialog.open(AreYouSureDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data: Investment) => {
      if (data) {
        this.firestore.setToBought(investment.uid).then(() => {
          this.snackbar.openSnackBar("Investition wurde gekauft.", "green-snackbar");
        }).catch((error) => {
          this.snackbar.openSnackBar("Setzen der Investition auf 'Gekauft' fehlgeschlagen.", "red-snackbar");
        })
      }
    });
  }

}
