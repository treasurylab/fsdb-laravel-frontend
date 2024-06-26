import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'src/app/models/dashboard/menu-item.model';

@Component({
  selector: 'app-menu-builder',
  templateUrl: './menu-builder.component.html',
  styleUrl: './menu-builder.component.scss',
})
export class MenuBuilderComponent {
  @Input({ required: true }) menuItem!: MenuItem;
  @Input({ required: true }) isCollapsed!: boolean;
  @Output() clickToggle = new EventEmitter<string>();

  tileClicked() {
    this.clickToggle.emit('clicked');
  }
}
