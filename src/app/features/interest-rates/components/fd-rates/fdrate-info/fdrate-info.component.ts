import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-fdrate-info',
  templateUrl: './fdrate-info.component.html',
  styleUrl: './fdrate-info.component.scss',
})
export class FdrateInfoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    public dialogRef: MatDialogRef<FdrateInfoComponent>
  ) {}

  ngOnInit(): void {}

  closeMe() {
    this.dialogRef.close();
  }
}
