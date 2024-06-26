import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FXRatesRoutingModule } from './fxrates-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { FxDashboardComponent } from './fx-dashboard/fx-dashboard.component';
import { FxrateoverviewComponent } from './fxrateoverview/fxrateoverview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FxRateContainerComponent } from './fxrateoverview/components/fx-rate-container/fx-rate-container.component';

@NgModule({
  declarations: [FxDashboardComponent, FxrateoverviewComponent, FxRateContainerComponent],
  imports: [
    CommonModule,
    FXRatesRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    SharedModule,
  ],
})
export class FXRatesModule {}
