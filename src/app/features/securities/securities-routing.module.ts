import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecuritiesOverviewComponent } from './securities-overview/securities-overview.component';

const routes: Routes = [
  {
    path: 'overview',
    component: SecuritiesOverviewComponent,
  },
  {
    path: 'ulip',
    loadChildren: () =>
      import('./ulip-rate/ulip-rate.module').then(
        (m) => m.UlipRateModule
      ),
  },
  {
    path: 'equity',
    loadChildren: () =>
      import('./equity-data/equity-data.module').then(
        (m) => m.EquityDataModule
      ),
  },
  {
    path: 'gsec',
    loadChildren: () => import('./gsec/gsec.module').then((m) => m.GsecModule),
  },
  {
    path: 'mutual-funds',
    loadChildren: () =>
      import('./mutual-funds/mutual-funds.module').then(
        (m) => m.MutualFundsModule
      ),
  },
  {
    path: 'mutual-funds/admin',
    loadChildren: () =>
      import('./mutual-funds-admin/mutual-funds-admin.module').then(
        (m) => m.MutualFundsAdminModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecuritiesRoutingModule {}
