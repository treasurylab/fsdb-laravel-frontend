import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MclrAdminRoutingModule } from './mclr-admin-routing.module';
import { MclrAutomationComponent } from './automation/mclr-automation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { EditMclrUrlComponent } from './automation/edit-mclr-url/edit-mclr-url.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AddRateEntryComponent } from './mclr-rate-entry/components/add-rate-entry/add-rate-entry.component';
import { EditRateEntryComponent } from './mclr-rate-entry/components/edit-rate-entry/edit-rate-entry.component';
import { ViewRateEntryComponent } from './mclr-rate-entry/components/view-rate-entry/view-rate-entry.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MclrAutomationComponent,
    EditMclrUrlComponent,
    AddRateEntryComponent,
    EditRateEntryComponent,
    ViewRateEntryComponent,
  ],
  imports: [
    CommonModule,
    MclrAdminRoutingModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    SharedModule,
  ],
})
export class MclrAdminModule {}
