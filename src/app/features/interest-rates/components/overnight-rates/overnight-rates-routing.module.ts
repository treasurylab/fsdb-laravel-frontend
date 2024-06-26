import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SofrComponent } from './sofr/sofr.component';
import { TonarComponent } from './tonar/tonar.component';
import { SoniaComponent } from './sonia/sonia.component';
import { EsterComponent } from './ester/ester.component';

const routes: Routes = [
  { path: 'sofr', component: SofrComponent },
  { path: 'tonar', component: TonarComponent },
  { path: 'sonia', component: SoniaComponent },
  { path: 'ester', component: EsterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvernightRatesRoutingModule {}
