import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MclrAutomationComponent } from './automation/mclr-automation.component';
import { MclrAumUploadComponent } from './mclr-aum-upload/mclr-aum-upload.component';

const routes: Routes = [
  {
    path: 'automation',
    component: MclrAutomationComponent,
  },
  {
    path: 'aum-upload',
    component: MclrAumUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MclrAdminRoutingModule {}
