import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxDashboardComponent } from './fx-dashboard/fx-dashboard.component';
import { FxrateoverviewComponent } from './fxrateoverview/fxrateoverview.component';

const routes: Routes = [
  { path: 'dashboard', component: FxDashboardComponent },
  { path: 'overview', component: FxrateoverviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FXRatesRoutingModule {}
