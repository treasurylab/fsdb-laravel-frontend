import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrl: './tab-view.component.scss',
})
export class TabViewComponent implements OnInit {
  @Input({ required: true }) tabs!: string[];
  @Output() tabSelected: EventEmitter<string> = new EventEmitter<string>();
  protected activeTab: string = '';

  ngOnInit(): void {
    this.activeTab = this.tabs[0];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.tabSelected.emit(tab);
  }
}
