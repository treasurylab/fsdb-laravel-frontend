import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GsecFbilComponent } from './gsec-fbil/gsec-fbil.component';
import { GsecRoutingModule } from './gsec-routing.module';
import { GsecCcilComponent } from './gsec-ccil/gsec-ccil.component';
import { MappedClassIdComponent } from './mapped-class-id/mapped-class-id.component';
import { GsecfbilmappingComponent } from './gsecfbilmapping/gsecfbilmapping.component';
import { SdlFbilMappingComponent } from './sdl-fbil-mapping/sdl-fbil-mapping.component';
import { SdlFbilMappinglistComponent } from './sdl-fbil-mappinglist/sdl-fbil-mappinglist.component';
import { GsecFbilMappinglistComponent } from './gsec-fbil-mappinglist/gsec-fbil-mappinglist.component';
import { TbillPricesComponent } from './tbill-prices/tbill-prices.component';
import { SdlRatesComponent } from './sdl-rates/sdl-rates.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    GsecFbilComponent,
    GsecCcilComponent,
    MappedClassIdComponent,
    GsecfbilmappingComponent,
    SdlFbilMappingComponent,
    SdlFbilMappinglistComponent,
    GsecFbilMappinglistComponent,
    TbillPricesComponent,
    SdlRatesComponent,
  ],

  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    GsecRoutingModule,
    FormsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GsecModule {}
