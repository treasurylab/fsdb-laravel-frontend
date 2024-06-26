import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table-chips',
  templateUrl: './table-chips.component.html',
  styleUrl: './table-chips.component.scss',
})
export class TableChipsComponent {
  @Input({ required: true }) dataArray: string[] = [];
}
