import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdSummaryComponent } from './fd-summary/fd-summary.component';
import { FdHistoryComponent } from './fd-history/fd-history.component';
import { FdCalculatorComponent } from './fd-calculator/fd-calculator.component';
import { FdDisplayComponent } from './fd-display/fd-display.component';
import { FdComparisonComponent } from './fd-comparison/fd-comparison.component';

const routes: Routes = [
  { path: 'fd-summary', component: FdSummaryComponent },
  { path: 'fd-history', component: FdHistoryComponent },
  { path: 'fd-calculator', component: FdCalculatorComponent },
  { path: 'fd-display', component: FdDisplayComponent },
  { path: 'fd-comparison', component: FdComparisonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdRatesRoutingModule {}
