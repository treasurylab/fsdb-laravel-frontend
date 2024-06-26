import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-form',
  templateUrl: './side-form.component.html',
  styleUrl: './side-form.component.scss',
})
export class SideFormComponent implements OnInit {
  @ViewChild('formNav', { static: true }) formNav!: MatSidenav;
  @Input() isOpened = false;
  @Input() enablePadding = true;

  ngOnInit(): void {
    if (this.isOpened) {
      this.formNav.open();
    }
  }

  public toggleFormNav() {
    this.formNav.toggle();
    this.isOpened = !this.isOpened;
  }
}
