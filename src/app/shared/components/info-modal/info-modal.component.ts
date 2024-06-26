import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InfoModalContent } from '../../models/info-modal';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {
  protected closeIcon = faXmark;
  constructor(
    @Inject(MAT_DIALOG_DATA) public cardContent: InfoModalContent,
    public dialogRef: MatDialogRef<InfoModalComponent>
  ) {}

  protected closeModal() {
    this.dialogRef.close();
  }
}
