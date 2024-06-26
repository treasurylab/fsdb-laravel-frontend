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
import {
  IconDefinition,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class TextFieldComponent implements OnInit, OnChanges {
  @ViewChild('inputField', { static: true }) inputField?: ElementRef;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() errorText: string = '';
  @Input() type:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'range'
    | 'tel'
    | 'search'
    | 'text'
    | 'time'
    | 'url'
    | 'week' = 'text';
  @Input() control: FormControl = new FormControl();
  @Input() disabled = false;
  @Output() onKeyUp = new EventEmitter<void>();
  @Output() onInputChanged = new EventEmitter<Event>();

  protected fieldId = '';
  protected buttonIcon?: IconDefinition;
  protected buttonToggle?: boolean;
  protected typingFields = [
    'email',
    'number',
    'password',
    'tel',
    'search',
    'text',
    'url',
  ];
  protected hasFocus = false;

  ngOnInit(): void {
    this.fieldId = this.label.replace(/\s/g, '').toLowerCase();
    if (this.type === 'password') {
      this.buttonToggle = false;
      this.buttonIcon = faEye;
    } else if (this.type === 'search') {
      this.buttonIcon = faMagnifyingGlass;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.control.disable();
    } else if (!changes['disabled']) {
      this.control.enable();
    }
  }

  protected onPasswordEyeClicked() {
    this.buttonToggle = !this.buttonToggle;
    this.buttonIcon = this.buttonToggle ? faEyeSlash : faEye;
    this.inputField?.nativeElement.setAttribute(
      'type',
      this.buttonToggle ? 'text' : 'password'
    );
  }

  protected onFocus() {
    this.hasFocus = true;
  }

  protected onBlur() {
    this.hasFocus = false;
  }

  protected onKeyUpCallback() {
    this.onKeyUp.emit();
  }

  protected onChange(event: Event) {
    this.onInputChanged.emit(event);
  }
}
