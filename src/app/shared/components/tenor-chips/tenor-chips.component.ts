import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tenor-chips',
  templateUrl: './tenor-chips.component.html',
  styleUrl: './tenor-chips.component.scss',
})
export class TenorChipsComponent {
  /**
   * This Component takes an @Array of strings (@buttonNameList ) and displayed them as chips.
   * Use @selectedTenor to highlight the selected tenor if the Button Name from @buttonNameList is equal to @selectedTenor
   * From the parent component @clickedButton can be used to harvest the value emitted.
   * Any key/value mismatch handling to be done on the parent component.
   */
  @Input({ required: true }) buttonNameList!: Array<string>;
  @Input() selectedTenor?: string;
  @Output() clickedButton = new EventEmitter<string>();

  sendClickToParent(buttonKey: string) {
    this.clickedButton.emit(buttonKey);
  }
}
