import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'src/app/models/dashboard/menu-item.model';

@Component({
  selector: 'app-menu-tile',
  templateUrl: './menu-tile.component.html',
  styleUrl: './menu-tile.component.scss',
})
export class MenuTileComponent {
  @Input({ required: true }) menuItem!: MenuItem;
  @Input({ required: true }) isCollapsed!: boolean;
  @Output() clicked = new EventEmitter<string>();
  showTooltip: boolean = false;

  tileClicked() {
    this.clicked.emit('clicked');
  }
}
