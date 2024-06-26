import { MatDialog } from '@angular/material/dialog';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { EditFactsheetComponent } from '../edit-factsheet/edit-factsheet.component';

@Component({
  selector: 'app-factsheet',
  templateUrl: './factsheet.component.html',
  styleUrl: './factsheet.component.scss',
})
export class FactsheetComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  protected dataSource = new MatTableDataSource();
  protected displayedColumns: string[] = [
    'Scheme id',
    'Record Name',
    'Portfolio AUM',
    'Factsheet AUM',
    'Average Maturity',
    'Modified Duration',
    'Gross YTM',
    'Expense Ratio',
    'Lock In Period',
    'Exit Load',
    'Status',
  ];
  protected filterIcon = faFilter;
  protected currentFormData?: any;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getSchemeFact(formData: any) {
    this.currentFormData = formData;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'getSchemeFact',
        formData
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dataSource.data = data['data'];
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected filterController() {
    this.sideNavObj.toggleFormNav();
  }

  protected editFactSheetModal(factSheetData?: any) {
    this.dialog.open(EditFactsheetComponent, {
      data: {
        factData: factSheetData,
        formData: this.currentFormData,
      },
    });
  }
}
