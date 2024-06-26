import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterestRatesRoutingModule } from './interest-rates-routing.module';
import { IntrestrateOverviewComponent } from './components/interest-rate-overview/interest-rate-overview.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [IntrestrateOverviewComponent],
  imports: [
    CommonModule,
    InterestRatesRoutingModule,
    MatIconModule,
    SharedModule,
  ],
})
export class InterestRatesModule {}
