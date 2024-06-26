import { Component, Input, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MenuItem } from 'src/app/models/dashboard/menu-item.model';

@Component({
  selector: 'app-menu-expansion',
  templateUrl: './menu-expansion.component.html',
  styleUrl: './menu-expansion.component.scss',
})
export class MenuExpansionComponent {
  @Input({ required: true }) menuItem!: MenuItem;
  @Input({ required: true }) isCollapsed!: boolean;
  protected isMouseHovering: boolean = false;
}
