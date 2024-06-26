import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mclr-tenor-view',
  templateUrl: './mclr-tenor-view.component.html',
  styleUrls: ['./mclr-tenor-view.component.scss'],
})
export class MclrTenorViewComponent {
  @Input() tenorList = new Array<{ mfreq_code: string; mfreq_type: string }>();
  protected displayedColumns: string[] = ['no', 'type', 'name'];
}
