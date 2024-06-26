import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenchmarkRatesRoutingModule } from './benchmark-rates-routing.module';
import { MiborTermComponent } from './mibor-term/mibor-term.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OvernightMiborComponent } from './overnight-mibor/overnight-mibor.component';
import { MiborOisComponent } from './mibor-ois/mibor-ois.component';
import { TbillCurveComponent } from './tbill-curve/tbill-curve.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CdCurveComponent } from './cd-curve/cd-curve.component';
import { RbiRatesComponent } from './rbi-rates/rbi-rates.component';
import { MiforRatesComponent } from './mifor-rates/mifor-rates.component';
import { RbiUploadComponent } from './rbi-upload/rbi-upload.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MiborTermComponent,
    OvernightMiborComponent,
    MiborOisComponent,
    TbillCurveComponent,
    CdCurveComponent,
    RbiRatesComponent,
    MiforRatesComponent,
    RbiUploadComponent,
  ],
  imports: [
    CommonModule,
    BenchmarkRatesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BenchmarkRatesModule {}
