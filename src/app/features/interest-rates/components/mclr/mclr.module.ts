import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MclrRoutingModule } from './mclr-routing.module';
import { MclrDashboardComponent } from './mclr-dashboard/mclr-dashboard.component';
import { MclrLatestComponent } from './mclr-latest/mclr-latest.component';
import { MclrTenorwiseComponent } from './mclr-tenorwise/mclr-tenorwise.component';
import { MclrComparisonComponent } from './mclr-comparison/mclr-comparison.component';
import { MclrHistoryComponent } from './mclr-history/mclr-history.component';
import { MclrRateEntryComponent } from '../mclr-admin/mclr-rate-entry/mclr-rate-entry.component';
import { MclrAumUploadComponent } from '../mclr-admin/mclr-aum-upload/mclr-aum-upload.component';
import { MclrCompSpecificComponent } from './mclr-comp-specific/mclr-comp-specific.component';
import { MclrBankMasterComponent } from './mclr-bank-master/mclr-bank-master.component';
import { MclrDownloadComponent } from './mclr-download/mclr-download.component';
import { MclrTenorViewComponent } from './mclr-download/components/mclr-tenor-view/mclr-tenor-view.component';
import { MclrRateViewComponent } from './mclr-download/components/mclr-rate-view/mclr-rate-view.component';
import { MclrCompMasterDataViewComponent } from './mclr-download/components/mclr-comp-master-data-view/mclr-comp-master-data-view.component';
import { MclrRateDownloadViewComponent } from './mclr-download/components/mclr-rate-download-view/mclr-rate-download-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MclrCompMastFormComponent } from './mclr-download/components/mclr-comp-master-data-view/components/mclr-comp-mast-form/mclr-comp-mast-form.component';
import { MclrRateFormComponent } from './mclr-download/components/mclr-rate-view/components/mclr-rate-form/mclr-rate-form.component';
import { MclrRateDownloadFormComponent } from './mclr-download/components/mclr-rate-download-view/components/mclr-rate-download-form/mclr-rate-download-form.component';

@NgModule({
  declarations: [
    MclrDashboardComponent,
    MclrLatestComponent,
    MclrTenorwiseComponent,
    MclrComparisonComponent,
    MclrHistoryComponent,
    MclrRateEntryComponent,
    MclrAumUploadComponent,
    MclrCompSpecificComponent,
    MclrBankMasterComponent,
    MclrDownloadComponent,
    MclrTenorViewComponent,
    MclrRateViewComponent,
    MclrCompMasterDataViewComponent,
    MclrRateDownloadViewComponent,
    MclrCompMastFormComponent,
    MclrRateFormComponent,
    MclrRateDownloadFormComponent,
    // DashboardBlockContainerComponent,
  ],
  imports: [CommonModule, MclrRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MclrModule {}
