import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvernightRatesRoutingModule } from './overnight-rates-routing.module';
import { SofrComponent } from './sofr/sofr.component';
import { SoniaComponent } from './sonia/sonia.component';
import { TonarComponent } from './tonar/tonar.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EsterComponent } from './ester/ester.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SofrComponent, SoniaComponent, TonarComponent, EsterComponent],
  imports: [
    CommonModule,
    OvernightRatesRoutingModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    SharedModule,
  ],
})
export class OvernightRatesModule {}
