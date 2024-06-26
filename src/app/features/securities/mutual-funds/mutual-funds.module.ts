import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MutualFundsRoutingModule } from './mutual-funds-routing.module';
import { NavInfoComponent } from './nav-info/nav-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SchemeAumComponent } from './scheme-aum/scheme-aum.component';
import { FundhouseAaumComponent } from './fundhouse-aaum/fundhouse-aaum.component';

@NgModule({
  declarations: [NavInfoComponent, SchemeAumComponent, FundhouseAaumComponent],
  imports: [
    MutualFundsRoutingModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDialogModule,
  ],
})
export class MutualFundsModule {}
