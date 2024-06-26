import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquityNse } from './equity-nse/equity-nse.component';
import { CorporateActionComponent } from './corporate-action/corporate-action.component';
import { MarketCapitalComponent } from './market-capital/market-capital.component';
import { EquityBse } from './equity-bse/equity-bse.component';
import { IndicesComponent } from './indices/indices.component';
import { UploadCorporateActionComponent } from './upload-corporate-action/upload-corporate-action.component';
import { EquityIsinMappingComponent } from './equity-isin-mapping/equity-isin-mapping.component';
import { UploadIndicesComponent } from './upload-indices/upload-indices.component';
import { EditEquityComponent } from './edit-equity/edit-equity.component';

const routes: Routes = [
  { path: 'equity-nse', component: EquityNse },
  { path: 'equity-bse', component: EquityBse },
  { path: 'indices', component: IndicesComponent },
  { path: 'corporate-action', component: CorporateActionComponent },
  { path: 'market-capital', component: MarketCapitalComponent },
  { path: 'equity-isin-mapping', component: EquityIsinMappingComponent },
  {
    path: 'upload-corporate-action',
    component: UploadCorporateActionComponent,
  },
  { path: 'upload-indices', component: UploadIndicesComponent },
  { path: 'equity-list', component: EditEquityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquityDataRoutingModule {}
