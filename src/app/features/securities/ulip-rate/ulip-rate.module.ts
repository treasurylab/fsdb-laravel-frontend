import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UlipRateRoutingModule } from './ulip-rate-routing.module';
import { UlipSchemeComponent } from './ulip-scheme/ulip-scheme.component';
import { AddUlipFundHousesComponent } from './ulip-admin/add-ulip-fund-houses/add-ulip-fund-houses.component';
import { AddUpdateUlipSchemeComponent } from './ulip-admin/add-update-ulip-scheme/add-update-ulip-scheme.component';
import { EditFundHouseComponent } from './ulip-admin/add-ulip-fund-houses/edit-fund-house-component/edit-fund-house-component.component';
import { EditUlipSchemeComponent } from './ulip-admin/add-update-ulip-scheme/edit-ulip-scheme/edit-ulip-scheme.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UlipSchemeComponent,
    AddUlipFundHousesComponent,
    AddUpdateUlipSchemeComponent,
    EditFundHouseComponent,
    EditUlipSchemeComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule,
    UlipRateRoutingModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UlipRateModule {}
