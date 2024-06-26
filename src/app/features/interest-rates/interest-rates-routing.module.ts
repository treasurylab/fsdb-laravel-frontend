import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntrestrateOverviewComponent } from './components/interest-rate-overview/interest-rate-overview.component';

const routes: Routes = [
  {
    path: 'overview',
    component: IntrestrateOverviewComponent,
  },
  {
    path: 'mclr',
    loadChildren: () =>
      import('./components/mclr/mclr.module').then((m) => m.MclrModule),
  },
  {
    path: 'mclr/admin',
    loadChildren: () =>
      import('./components/mclr-admin/mclr-admin.module').then(
        (m) => m.MclrAdminModule
      ),
  },
  {
    path: 'fd-rates',
    loadChildren: () =>
      import('./components/fd-rates/fd-rates.module').then(
        (m) => m.FdRatesModule
      ),
  },

  {
    path: 'benchmark-rates/in',
    loadChildren: () =>
      import('./components/benchmark-rates/benchmark-rates.module').then(
        (m) => m.BenchmarkRatesModule
      ),
  },
  {
    path: 'benchmark-rates/global',
    loadChildren: () =>
      import('./components/overnight-rates/overnight-rates.module').then(
        (m) => m.OvernightRatesModule
      ),
  },
  // {
  //   path: 'fd-rates',
  //   loadChildren: () =>
  //     import('./components/fd-rates/fd-rates.module').then(
  //       (m) => m.FdRatesModule
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterestRatesRoutingModule {}
