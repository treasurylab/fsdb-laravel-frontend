import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavInfoComponent } from './nav-info/nav-info.component';
import { SchemeAumComponent } from './scheme-aum/scheme-aum.component';
import { FundhouseAaumComponent } from './fundhouse-aaum/fundhouse-aaum.component';

const routes: Routes = [
  {
    path: 'nav-info',
    component: NavInfoComponent,
  },
  {
    path: 'scheme-aum',
    component: SchemeAumComponent,
  },
  {
    path: 'fundhouse-aaum',
    component: FundhouseAaumComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutualFundsRoutingModule {}
