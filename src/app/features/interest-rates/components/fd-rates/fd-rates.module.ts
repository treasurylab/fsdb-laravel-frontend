import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FdRatesRoutingModule } from './fd-rates-routing.module';
import { FdComparisonComponent } from './fd-comparison/fd-comparison.component';
import { FdHistoryComponent } from './fd-history/fd-history.component';
import { FdSummaryComponent } from './fd-summary/fd-summary.component';
import { FdDisplayComponent } from './fd-display/fd-display.component';
import { FdCalculatorComponent } from './fd-calculator/fd-calculator.component';
import { FdrateInfoComponent } from './fdrate-info/fdrate-info.component';
import { SharedModule } from '../../../../shared/shared.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // If not already imported
import { MatRadioModule } from '@angular/material/radio'; // Import MatRadioModule
import { MatSliderModule } from '@angular/material/slider';
// import { DashboardBlockContainerComponent } from '../../../../shared/components/mclr-block-container/mclr-block-container.component';
@NgModule({
  declarations: [
    FdComparisonComponent,
    FdHistoryComponent,
    FdSummaryComponent,
    FdDisplayComponent,
    FdCalculatorComponent,
    FdrateInfoComponent,
    // DashboardBlockContainerComponent,
  ],
  imports: [
    CommonModule,
    FdRatesRoutingModule,
    SharedModule,
    MatRadioModule,
    MatSliderModule,
  ],
})
export class FdRatesModule {}
