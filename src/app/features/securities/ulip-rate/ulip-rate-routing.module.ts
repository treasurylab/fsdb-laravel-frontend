import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UlipSchemeComponent } from './ulip-scheme/ulip-scheme.component';
import { AddUlipFundHousesComponent } from './ulip-admin/add-ulip-fund-houses/add-ulip-fund-houses.component';
import { AddUpdateUlipSchemeComponent } from './ulip-admin/add-update-ulip-scheme/add-update-ulip-scheme.component';

const routes: Routes = [
  {
    path: 'ulip-scheme',
    component: UlipSchemeComponent,
  },
  {
    path: 'ulip-fund-house',
    component: AddUlipFundHousesComponent,
  },
  {
    path: 'ulip-update-scheme',
    component: AddUpdateUlipSchemeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UlipRateRoutingModule { }
