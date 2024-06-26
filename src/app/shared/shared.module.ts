import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DashboardCardRelComponent } from './components/dashboard-card-collapsable/dashboard-card-rel.component';
import { SimpleFooterComponent } from './components/simple-footer/simple-footer.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { FundHouseFilterPipe } from '../pipes/mutual-funds/fund-house-filter/fund-house-filter.component';
import { AppButtonComponent } from './components/buttons/app-button/app-button.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ContentCardComponent } from './components/cards/content-card/content-card.component';
import { TextFieldComponent } from './components/input-fields/text-field/text-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PageTitleSmallComponent } from './components/page-title-small/page-title-small.component';
import { BlockContentComponent } from './components/content/block-content/block-content.component';
import { TenorChipsComponent } from './components/tenor-chips/tenor-chips.component';
import { ValueContentComponent } from './components/content/value-content/value-content.component';
import { TableComponent } from './components/table/table.component';
import { SelectFieldComponent } from './components/input-fields/select-field/select-field.component';
import { LineGraphComponent } from './components/graphs/line-graph/line-graph.component';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TabViewComponent } from './components/tab-view/tab-view.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideFormComponent } from './components/side-form/side-form.component';
import { TabbedDateFormComponent } from './components/forms/tabbed-date-form/tabbed-date-form.component';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardBlockContainerComponent } from './components/dashboard-block-container/dashboard-block-container.component';
import { TableChipsComponent } from './components/table-chips/table-chips.component';
@NgModule({
  declarations: [
    DashboardBlockContainerComponent,
    DashboardCardComponent,
    DashboardCardRelComponent,
    SimpleFooterComponent,
    InfoModalComponent,
    FundHouseFilterPipe,
    AppButtonComponent,
    PageTitleComponent,
    ContentCardComponent,
    TextFieldComponent,
    SearchBarComponent,
    PageTitleSmallComponent,
    BlockContentComponent,
    TenorChipsComponent,
    ValueContentComponent,
    TableComponent,
    SelectFieldComponent,
    LineGraphComponent,
    TabViewComponent,
    SideFormComponent,
    TabbedDateFormComponent,
    PageContainerComponent,
    TableChipsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    // Material Component Modules.
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
  ],
  exports: [
    // Modules
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatTableModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,

    // Pipes
    FundHouseFilterPipe,

    // Components

    AppButtonComponent,
    PageTitleComponent,
    PageTitleSmallComponent,
    PageContainerComponent,
    ContentCardComponent,
    TextFieldComponent,
    SearchBarComponent,
    BlockContentComponent,
    ValueContentComponent,
    TenorChipsComponent,
    TableComponent,
    SelectFieldComponent,
    LineGraphComponent,
    TabViewComponent,
    SideFormComponent,
    TabbedDateFormComponent,
    DashboardBlockContainerComponent,
    TableChipsComponent,
  ],
})
export class SharedModule {}
