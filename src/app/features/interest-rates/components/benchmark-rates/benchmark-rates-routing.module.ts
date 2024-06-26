import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiborTermComponent } from './mibor-term/mibor-term.component';
import { OvernightMiborComponent } from './overnight-mibor/overnight-mibor.component';
import { MiborOisComponent } from './mibor-ois/mibor-ois.component';
import { TbillCurveComponent } from './tbill-curve/tbill-curve.component';
import { CdCurveComponent } from './cd-curve/cd-curve.component';
import { RbiRatesComponent } from './rbi-rates/rbi-rates.component';
import { MiforRatesComponent } from './mifor-rates/mifor-rates.component';
import { RbiUploadComponent } from './rbi-upload/rbi-upload.component';

const routes: Routes = [
  { path: 'mibor-data', component: MiborTermComponent },
  { path: 'overnight-mibor', component: OvernightMiborComponent },
  { path: 'mibor-ois-data', component: MiborOisComponent },
  { path: 'tbill-tenor-rate', component: TbillCurveComponent },
  { path: 'cd-rates', component: CdCurveComponent },
  { path: 'rbi-reporate', component: RbiRatesComponent },
  { path: 'mifor-rates', component: MiforRatesComponent },
  { path: 'rbi-upload', component: RbiUploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenchmarkRatesRoutingModule {}
