import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { MclrCompMasterDataViewComponent } from './components/mclr-comp-master-data-view/mclr-comp-master-data-view.component';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { MclrRateViewComponent } from './components/mclr-rate-view/mclr-rate-view.component';
import { MclrRateDownloadViewComponent } from './components/mclr-rate-download-view/mclr-rate-download-view.component';

@Component({
  selector: 'app-mclr-download',
  templateUrl: './mclr-download.component.html',
  styleUrls: ['./mclr-download.component.scss'],
})
export class MclrDownloadComponent implements OnInit {
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  @ViewChild('compMastDataView')
  compMastDataView?: MclrCompMasterDataViewComponent;
  @ViewChild('mclrRateView') mclrRateView!: MclrRateViewComponent;
  @ViewChild('mclrRateDownloadView')
  mclrRateDownloadView!: MclrRateDownloadViewComponent;
  protected tabs!: string[];
  protected activeTab!: string;
  protected sideNavTitle = '';
  protected sideNavAction = '';
  protected sideFormPayload?: any;
  protected readonly tenorList = [
    { mfreq_code: '001', mfreq_type: 'Overnight' },
    { mfreq_code: '002', mfreq_type: '1 Month' },
    { mfreq_code: '003', mfreq_type: '3 Months' },
    { mfreq_code: '004', mfreq_type: '6 Months' },
    { mfreq_code: '005', mfreq_type: '1 Year' },
    { mfreq_code: '006', mfreq_type: '2 Years' },
    { mfreq_code: '007', mfreq_type: '3 Years' },
    { mfreq_code: '008', mfreq_type: '5 Years' },
  ];
  protected allCompaniesList: any = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.tabs = ['MCLR Tenor', 'Company Master Data', 'MCLR Rate'];
    const companyGrp = localStorage.getItem('cgrp_id');
    if (companyGrp && companyGrp === '00') {
      this.tabs.push('MCLR Download');
    }
    this.activeTab = this.tabs[0];
    this.getAllCompList();
  }

  protected onTabChange(activeTab: string) {
    this.activeTab = activeTab;
    if (activeTab === this.tabs[2] || activeTab === this.tabs[3]) {
      if (!this.sideForm.isOpened) {
        this.sideForm.toggleFormNav();
      }
    } else if (this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  private getAllCompList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getAllCompList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.allCompaniesList = data.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected compMastFormController(params: { action: string; payload?: any }) {
    if (this.activeTab === this.tabs[1]) {
      if (params.action === 'add') {
        this.sideNavTitle = 'Add Data';
        this.sideFormPayload = undefined;
      } else if (params.action === 'edit') {
        this.sideNavTitle = 'Edit Data';
        this.sideFormPayload = params.payload;
      } else if (params.action === 'view') {
        this.sideNavTitle = 'View Data';
        this.sideFormPayload = params.payload;
      } else {
        return;
      }
      this.sideNavAction = params.action;
    }
    return;
  }

  protected compMastFormResultCallback(shouldRefresh: boolean) {
    if (shouldRefresh && this.compMastDataView) {
      this.compMastDataView.getCompBankList();
    }
  }

  protected mclrRateFormCallback(formData: any) {
    this.mclrRateView.getRateList(formData);
  }

  protected mclrRateDownloadFormCallback(formData: any) {
    this.mclrRateDownloadView.downloadMclrRates(formData);
  }
}
