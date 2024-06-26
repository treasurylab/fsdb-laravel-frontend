import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fx-rate-container',
  templateUrl: './fx-rate-container.component.html',
  styleUrl: './fx-rate-container.component.scss',
})
export class FxRateContainerComponent {
  @Input({ required: true }) fxRateTitle!: string;
  @Input({ required: true }) fxRate!: string;
  @Input() fxRateImageSrc?: string;
  @Input() bgColor?: string = '#1C326B';
}
