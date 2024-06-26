import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SebiCatgComponent } from './sebi-catg/sebi-catg.component';
import { FundHouseComponent } from './fund-house/fund-house.component';
import { LoneSchemeComponent } from './l1-scheme/lone-scheme.component';
import { LtwoSchemeComponent } from './l2-scheme/ltwo-scheme.component';
import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';

const routes: Routes = [
  {
    path: 'sebi-catg',
    component: SebiCatgComponent,
  },
  {
    path: 'fund-house',
    component: FundHouseComponent,
  },
  {
    path: 'lone-scheme',
    component: LoneSchemeComponent,
  },
  {
    path: 'ltwo-scheme',
    component: LtwoSchemeComponent,
  },
  {
    path: 'portfolio-management',
    component: PortfolioManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutualFundsAdminRoutingModule {}
