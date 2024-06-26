import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
})
export class SelectFieldComponent implements OnInit, OnChanges {
  @ViewChild('inputField', { static: true }) inputField?: ElementRef;
  @Input() label: string = '';
  @Input() errorText: string = '';
  @Input() placeHolder: string = '';
  @Input() control: FormControl = new FormControl();
  @Output() selectionChanged = new EventEmitter<void>();

  protected fieldId = '';

  ngOnInit(): void {
    this.fieldId = this.label.replace(/\s/g, '').toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.control.disable();
    } else if (!changes['disabled']) {
      this.control.enable();
    }
  }

  protected onSelectionChange() {
    this.selectionChanged.emit();
  }
}
