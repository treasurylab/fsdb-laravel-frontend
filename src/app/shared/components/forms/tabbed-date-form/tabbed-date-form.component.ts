import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tabbed-date-form',
  templateUrl: './tabbed-date-form.component.html',
  styleUrl: './tabbed-date-form.component.scss',
})
export class TabbedDateFormComponent {
  @Input({ required: true }) formGroup = new FormGroup({
    fromdate: new FormControl('', [Validators.required]),
    todate: new FormControl(''),
    selectedOption: new FormControl('A', [Validators.required]),
  });
  @Output() onFormSubmitted = new EventEmitter<void>();
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;
  protected tabs = ['Key Date', 'Range'];
  protected activeTab = 'Key Date';

  protected onTabChange(event: string): void {
    this.activeTab = event;
    if (event === this.tabs[0]) {
      this.formGroup.patchValue({
        selectedOption: 'A',
      });
    } else {
      this.formGroup.patchValue({
        selectedOption: 'B',
      });
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.formGroup.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected onSubmit() {
    this.onFormSubmitted.emit();
  }
}
