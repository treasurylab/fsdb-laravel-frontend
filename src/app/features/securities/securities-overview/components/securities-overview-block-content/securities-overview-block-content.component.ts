import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-securities-overview-block-content',
  templateUrl: './securities-overview-block-content.component.html',
  styleUrl: './securities-overview-block-content.component.scss',
})
export class SecuritiesOverviewBlockContentComponent {
  /** This component shows a value with a rate as well as a date.
   * @title variable to set the title,
   * @value to set the value,
   * @date variable to set the date,
   * @bgColor to set the color as a hex string 'EX: #fafafa'
   * TODO: make date string variable
   * TODO: add icon support
   */
  @Input() icon = 'show_chart';
  @Input({ required: true }) title!: string;
  @Input() date?: string;
  @Input({ required: true }) value!: string;
  @Input() bgColor = '#1C326B';
}
