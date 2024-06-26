import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecuritiesRoutingModule } from './securities-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SecuritiesOverviewComponent } from './securities-overview/securities-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecuritiesOverviewBlockContentComponent } from './securities-overview/components/securities-overview-block-content/securities-overview-block-content.component';

@NgModule({
  declarations: [SecuritiesOverviewComponent, SecuritiesOverviewBlockContentComponent],
  imports: [
    CommonModule,
    SecuritiesRoutingModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
})
export class SecuritiesModule {}
