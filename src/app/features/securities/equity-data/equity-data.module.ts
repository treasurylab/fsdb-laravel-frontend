import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { EquityDataRoutingModule } from './equity-data-routing.module';
import { EquityNse } from './equity-nse/equity-nse.component';
import { CorporateActionComponent } from './corporate-action/corporate-action.component';
import { MarketCapitalComponent } from './market-capital/market-capital.component';
import { IndicesComponent } from './indices/indices.component';
import { EquityBse } from './equity-bse/equity-bse.component';
import { UploadCorporateActionComponent } from './upload-corporate-action/upload-corporate-action.component';
import { EquityIsinMappingComponent } from './equity-isin-mapping/equity-isin-mapping.component';
import { UploadIndicesComponent } from './upload-indices/upload-indices.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditEquityComponent } from './edit-equity/edit-equity.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditNSEEquityComponent } from './edit-equity/components/edit-nseequity/edit-nseequity.component';
import { EditBSEEquityComponent } from './edit-equity/components/edit-bseequity/edit-bseequity.component';
import { AddNseIsinComponent } from './edit-equity/components/edit-nseequity/components/add-nse-isin/add-nse-isin.component';
import { AddBseIsinComponent } from './edit-equity/components/edit-bseequity/components/add-bse-isin/add-bse-isin.component';

@NgModule({
  declarations: [
    EquityNse,
    CorporateActionComponent,
    MarketCapitalComponent,
    IndicesComponent,
    EquityBse,
    UploadCorporateActionComponent,
    EquityNse,
    EquityIsinMappingComponent,
    UploadIndicesComponent,
    EditEquityComponent,
    EditNSEEquityComponent,
    EditBSEEquityComponent,
    AddNseIsinComponent,
    AddBseIsinComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    EquityDataRoutingModule,
    SharedModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EquityDataModule {}
