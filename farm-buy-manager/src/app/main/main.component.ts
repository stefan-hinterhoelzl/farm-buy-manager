import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AddInvestmentDialogComponent } from '../dialogs/add-investment-dialog/add-investment-dialog.component';
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
  openinvestments: Investment[] = []
  openinvestmentsArrayMoving: Investment[] = []
  boughtinvestments: Investment[] = []
  displayedColumns: string[] = ['item', 'price', 'createdby', 'createdat', 'points', 'action1', 'action2'];
  displayedColumnsBought: string[] = ['item', 'price', 'createdby', 'createdat', 'action2'];

  ngOnInit(): void {
    this.firestore.investmentStatus.subscribe(async (data) => {
      if (data != null) {
        this.openinvestmentsArrayMoving.length = 0;
        this.openinvestments = data.filter((value) => {return value.bought == false})
        this.openinvestments.forEach((value) => this.openinvestmentsArrayMoving.push(Object.assign({}, value)))
        this.boughtinvestments = data.filter((value) => {return value.bought == true})
        this.loading = false;
      }
    })
  }


  openAddDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "300px"
    dialogConfig.width = "700px"
    dialogConfig.minWidth = "500px"
    dialogConfig.minHeight = "300px"

    const dialogRef = this.dialog.open(AddInvestmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(take(1)).subscribe((data: Investment) => {
      this.firestore.addInvestment(data).then((data) => {
        this.snackbar.openSnackBar("Investment erfolreich hinzugefügt", "green-snackbar")
      }).catch((error) => {
        this.snackbar.openSnackBar("Fehler beim Hinzufügen des Investmens", "red-snackbar")
      });
    }); 
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.openinvestmentsArrayMoving, event.previousIndex, event.currentIndex);
  }


  saveRanking() {
    let passingarray:Investment[] = []
    this.openinvestmentsArrayMoving.forEach((value) => passingarray.push(Object.assign({}, value)));
    this.firestore.saveRanking(passingarray).then(async (data) => {
      this.snackbar.openSnackBar("Ranking gespeichert!", "green-snackbar")
    });
  }

  deleteInvestment(investment: Investment) {
    this.firestore.delete(investment.uid);
  }

  buyInvestment(investment: Investment) {
    this.firestore.setToBought(investment.uid);
  }

}