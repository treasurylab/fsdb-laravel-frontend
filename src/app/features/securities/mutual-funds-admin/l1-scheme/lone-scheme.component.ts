import { AddEditLoneSchemeComponent } from './components/add-edit-lone-scheme/add-edit-lone-scheme.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { FundManagerMappingComponent } from './components/fund-manager-mapping/fund-manager-mapping.component';
import { FactsheetComponent } from './components/factsheet/factsheet.component';

@Component({
  selector: 'app-lone-scheme',
  templateUrl: './lone-scheme.component.html',
  styleUrls: ['./lone-scheme.component.scss'],
})
export class LoneSchemeComponent {
  @ViewChild(SideFormComponent) sideFormObj!: SideFormComponent;
  @ViewChild('addEditLoneSchemeView')
  addEditLoneSchemeView?: AddEditLoneSchemeComponent;
  @ViewChild('fundManagerMappingView')
  fundManagerMappingView?: FundManagerMappingComponent;
  @ViewChild('factsheetView') factsheetView?: FactsheetComponent;

  protected addIcon = faPlus;

  protected tabs = [
    'Add/Edit L1 Scheme',
    'Fund Manager Entry',
    'Mapping Fund Manager',
    'Factsheet',
  ];
  protected activeTab = 'Add/Edit L1 Scheme';

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

  // Add/Edit L1 Scheme
  protected addEditLoneFormController(params: {
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

  protected addEditLoneFormCallback() {
    this.addEditLoneSchemeView?.fetchLOneList();
  }

  // Fund Manager
  protected fundManagerEntryController(params: {
    action: string;
    payload?: { fundmng_id: string; fundmng_name: string };
  }) {
    if (this.activeTab === this.tabs[1]) {
      if (params.action === 'add') {
        this.sideNavTitle = 'Add Fund Manager';
      } else if (params.action === 'edit') {
        this.sideNavTitle = 'Edit Fund Manager';
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

  // Fund Manager Mapping
  protected fundManagerMappingController(params: {
    action: string;
    payload?: any;
  }) {
    if (this.activeTab === this.tabs[2]) {
      const action = params.action;
      if (this.sideFormObj.isOpened) {
        if (
          (action === 'add' && this.sideNavTitle === 'Add Fund Manager') ||
          (action === 'edit' && this.sideNavTitle === 'Edit Fund Manager') ||
          (action === 'filter' && this.sideNavTitle === '')
        ) {
          if (action === 'filter') {
            this.sideFormObj.toggleFormNav();
          } else {
            this.sideFormPayload = params;
          }
          return;
        }
        this.sideFormObj.toggleFormNav();
        setTimeout(() => {
          this.fundManagerMappingFormActions(action, params);
        }, 200);
      } else {
        this.fundManagerMappingFormActions(action, params);
      }
    }
    return;
  }

  private fundManagerMappingFormActions(action: string, params?: any) {
    if (action === 'add') {
      this.sideNavTitle = 'Add Fund Manager';
    } else if (action === 'edit') {
      this.sideNavTitle = 'Edit Fund Manager';
    } else if (action === 'filter') {
      this.sideNavTitle = '';
      this.sideFormPayload = undefined;
    } else {
      return;
    }
    this.sideFormPayload = params;
    if (!this.sideFormObj.isOpened) {
      this.sideFormObj.toggleFormNav();
    }
  }

  protected fundManagerMappingCallback(result: boolean) {
    if (result) {
      this.fundManagerMappingDataCallback();
    }
    if (this.sideFormObj.isOpened) {
      this.sideFormObj.toggleFormNav();
    }
    if (this.sideNavTitle !== '') {
      setTimeout(() => {
        this.fundManagerMappingFormActions('filter', undefined);
      }, 200);
    }
  }

  protected fundManagerMappingDataCallback(formData?: any) {
    let currentFilter;
    if (formData === undefined) {
      currentFilter = this.lastFilterForm;
    } else {
      currentFilter = formData;
      this.lastFilterForm = formData;
    }
    this.fundManagerMappingView?.getMappingDetails(currentFilter);
  }

  // Factsheet
  protected factsheetCallback(formData: any) {
    this.factsheetView?.getSchemeFact(formData);
  }
}
