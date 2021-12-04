import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.scss']
})
export class AreYouSureDialogComponent implements OnInit {

  title: string;
  content: string; 

  constructor(private dialogRef: MatDialogRef<AreYouSureDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.title = data.title;
    this.content = data.content;
  }

  ngOnInit(): void {
  }


  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(true);
  }
}
