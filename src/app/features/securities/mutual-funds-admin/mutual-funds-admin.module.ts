import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MutualFundsAdminRoutingModule } from './mutual-funds-admin-routing.module';
import { SebiCatgComponent } from './sebi-catg/sebi-catg.component';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FundHouseComponent } from './fund-house/fund-house.component';
import { EditFundHouseComponent } from './fund-house/components/edit-fund-house/edit-fund-house.component';
import { AddMonthlyAumComponent } from './fund-house/components/add-monthly-aum/add-monthly-aum.component';
import { EditMonthlyAumComponent } from './fund-house/components/edit-monthly-aum/edit-monthly-aum.component';
import { LoneSchemeComponent } from './l1-scheme/lone-scheme.component';
import { EditFactsheetComponent } from './l1-scheme/components/edit-factsheet/edit-factsheet.component';
import { LtwoSchemeComponent } from './l2-scheme/ltwo-scheme.component';
import { EditLtwoSchemeComponent } from './l2-scheme/components/edit-ltwo-scheme/edit-ltwo-scheme.component';
import { UpdateSymbolComponent } from './l2-scheme/components/update-symbol/update-symbol.component';
import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';
import { AddEditLoneSchemeComponent } from './l1-scheme/components/add-edit-lone-scheme/add-edit-lone-scheme.component';
import { AddEditLoneSchFormComponent } from './l1-scheme/components/add-edit-lone-scheme/components/add-edit-lone-sch-form/add-edit-lone-sch-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FundManagerEntryComponent } from './l1-scheme/components/fund-manager-entry/fund-manager-entry.component';
import { FundManagerEntryFormComponent } from './l1-scheme/components/fund-manager-entry/components/fund-manager-entry-form/fund-manager-entry-form.component';
import { FundManagerMappingComponent } from './l1-scheme/components/fund-manager-mapping/fund-manager-mapping.component';
import { FundManagerMappingFormComponent } from './l1-scheme/components/fund-manager-mapping/components/fund-manager-mapping-form/fund-manager-mapping-form.component';
import { FactsheetComponent } from './l1-scheme/components/factsheet/factsheet.component';
import { FactsheetFormComponent } from './l1-scheme/components/factsheet/components/factsheet-form/factsheet-form.component';
import { EditFundHouseFormComponent } from './fund-house/components/edit-fund-house-form/edit-fund-house-form.component';
import { AddAssetTypeComponent } from './portfolio-management/components/add-asset-type/add-asset-type.component';
import { EditAssetTypeComponent } from './portfolio-management/components/edit-asset-type/edit-asset-type.component';
import { AddTemplateComponent } from './portfolio-management/components/add-template/add-template.component';
import { EditTemplateComponent } from './portfolio-management/components/edit-template/edit-template.component';
import { AddPortfolioComponent } from './portfolio-management/components/add-portfolio/add-portfolio.component';

@NgModule({
  declarations: [
    SebiCatgComponent,
    FundHouseComponent,
    EditFundHouseComponent,
    AddMonthlyAumComponent,
    EditMonthlyAumComponent,
    LoneSchemeComponent,
    EditFactsheetComponent,
    LtwoSchemeComponent,
    EditLtwoSchemeComponent,
    UpdateSymbolComponent,
    PortfolioManagementComponent,
    AddEditLoneSchemeComponent,
    AddEditLoneSchFormComponent,
    FundManagerEntryComponent,
    FundManagerEntryFormComponent,
    FundManagerMappingComponent,
    FundManagerMappingFormComponent,
    FactsheetComponent,
    FactsheetFormComponent,
    EditFundHouseFormComponent,
    AddAssetTypeComponent,
    EditAssetTypeComponent,
    AddTemplateComponent,
    EditTemplateComponent,
    AddPortfolioComponent,
  ],
  imports: [
    CommonModule,
    MutualFundsAdminRoutingModule,
    MatTableModule,
    ReactiveFormsModule,
    SharedModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTooltipModule,
  ],
})
export class MutualFundsAdminModule {}
