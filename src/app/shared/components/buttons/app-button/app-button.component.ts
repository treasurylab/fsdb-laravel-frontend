import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
})
export class AppButtonComponent implements OnInit, OnChanges {
  @Output() onTap = new EventEmitter<void>();
  @Input() disabled = false;
  @Input() btnClass: 'primary' | 'secondary' | 'tertiary' | 'danger' =
    'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() expanded = false;

  protected buttonColorScheme =
    'text-white bg-blue-900 hover:bg-blue-800 focus:ring-blue-300';

  ngOnInit(): void {
    this.refreshBtnColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.refreshBtnColor();
    }
  }

  private refreshBtnColor() {
    if (this.disabled) {
      this.buttonColorScheme = 'text-gray-600 bg-gray-200';
      return;
    }
    switch (this.btnClass) {
      case 'primary':
        this.buttonColorScheme =
          'text-white bg-blue-900 hover:bg-blue-800 focus:ring-blue-200';
        break;
      case 'secondary':
        this.buttonColorScheme =
          'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200';
        break;
      case 'tertiary':
        this.buttonColorScheme =
          'text-white bg-green-500 hover:bg-green-600 focus:ring-green-200';
        break;
      case 'danger':
        this.buttonColorScheme =
          'text-white bg-red-600 hover:bg-red-700 focus:ring-red-200';
        break;
    }
  }

  protected onClickHandler() {
    this.onTap.emit();
  }
}
