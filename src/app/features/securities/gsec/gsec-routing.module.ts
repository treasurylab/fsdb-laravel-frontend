import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GsecFbilComponent } from './gsec-fbil/gsec-fbil.component';
import { GsecCcilComponent } from './gsec-ccil/gsec-ccil.component';
import { MappedClassIdComponent } from './mapped-class-id/mapped-class-id.component';
import { GsecfbilmappingComponent } from './gsecfbilmapping/gsecfbilmapping.component';
import { SdlFbilMappingComponent } from './sdl-fbil-mapping/sdl-fbil-mapping.component';
import { GsecFbilMappinglistComponent } from './gsec-fbil-mappinglist/gsec-fbil-mappinglist.component';
import { SdlFbilMappinglistComponent } from './sdl-fbil-mappinglist/sdl-fbil-mappinglist.component';
import { TbillPricesComponent } from './tbill-prices/tbill-prices.component';
import { SdlRatesComponent } from './sdl-rates/sdl-rates.component';

const routes: Routes = [
  {
    path: 'gsec-fbil',
    component: GsecFbilComponent,
  },
  {
    path: 'gsec-ccil',
    component: GsecCcilComponent,
  },
  {
    path: 'tbill-prices',
    component: TbillPricesComponent,
  },
  {
    path: 'class-id-mapping',
    component: MappedClassIdComponent,
  },
  {
    path: 'gsec-classid-mapping',
    component: GsecfbilmappingComponent,
  },
  {
    path: 'sdl-classid-mapping',
    component: SdlFbilMappingComponent,
  },
  {
    path: 'gsec-classid-mapping-list',
    component: GsecFbilMappinglistComponent,
  },
  {
    path: 'sdl-classid-mapping-list',
    component: SdlFbilMappinglistComponent,
  },
  { path: 'sdl-rates', component: SdlRatesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GsecRoutingModule {}
