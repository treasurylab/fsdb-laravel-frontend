import { Component, Input } from '@angular/core';
import { InfoModalContent } from '../../models/info-modal';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
})
export class PageTitleComponent {
  @Input() position: 'start' | 'end' = 'start';
  @Input() subHeading?: string;
  @Input() pageInfo?: InfoModalContent;
  @Input() isCardTitle?: boolean = false;
  @Input() tooltip?: string;
  protected infoIcon = faCircleInfo;

  constructor(private dialog: MatDialog) {}

  protected openModal() {
    if (this.pageInfo !== undefined) {
      this.dialog.open(InfoModalComponent, {
        panelClass: 'custom-mat-dialog',
        data: this.pageInfo,
      });
    }
  }
}
