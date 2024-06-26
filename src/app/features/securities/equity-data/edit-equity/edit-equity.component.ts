import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { EditNSEEquityComponent } from './components/edit-nseequity/edit-nseequity.component';

@Component({
  selector: 'app-edit-equity',
  templateUrl: './edit-equity.component.html',
  styleUrl: './edit-equity.component.scss'
})
export class EditEquityComponent {
  @ViewChild(SideFormComponent) sideFormObj!: SideFormComponent;
  @ViewChild('addEditLoneSchemeView')
  addEditLoneSchemeView?: EditNSEEquityComponent;
  protected addIcon = faPlus;

  protected tabs = [
    'NSE Equity',
    'BSE Equity',
  ];
  protected activeTab = 'NSE Equity';

  protected sideNavTitle: string = '';
  protected sideFormPayload?: any;

  protected lastFilterForm?: any;

  constructor(protected dialog: MatDialog) {}

  protected onTabChanged(tab: string) {
    this.sideNavTitle = '';
    this.sideFormPayload = undefined;
    this.activeTab = tab;
    if (this.activeTab === this.tabs[2] || this.activeTab === this.tabs[3]) {
      if (!this.sideFormObj.isOpened) {
        this.sideFormObj.toggleFormNav();
      }
      return;
    }
    if (this.sideFormObj.isOpened) {
      this.sideFormObj.toggleFormNav();
    }
  }

  // Add NSE equity
  protected addNseEqFormController(params: {
    action: string;
    payload: object | undefined;
  }) {
    if (this.activeTab === this.tabs[0]) {
      if (params.action === 'add') {
        this.sideNavTitle = 'Add Data';
      } else if (params.action === 'edit') {
        this.sideNavTitle = 'Edit Data';
      } else {
        return;
      }
      this.sideFormPayload = params;
    }
    if (!this.sideFormObj.isOpened) {
      this.sideFormObj.toggleFormNav();
    }
    return;
  }

}
