import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: 'dashboard', component: MclrDashboardComponent },
  { path: 'latest', component: MclrLatestComponent },
  { path: 'tenor-wise', component: MclrTenorwiseComponent },
  { path: 'comparison', component: MclrComparisonComponent },
  { path: 'history', component: MclrHistoryComponent },
  { path: 'rate-entry', component: MclrRateEntryComponent },
  { path: 'aum-upload', component: MclrAumUploadComponent },
  { path: 'company-specific', component: MclrCompSpecificComponent },
  { path: 'bank-master', component: MclrBankMasterComponent },
  { path: 'download', component: MclrDownloadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MclrRoutingModule {}
