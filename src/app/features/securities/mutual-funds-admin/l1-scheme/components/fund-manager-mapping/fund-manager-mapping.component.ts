import { ApiService } from 'src/app/shared/services/api/api.service';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { filter, first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-fund-manager-mapping',
  templateUrl: './fund-manager-mapping.component.html',
  styleUrl: './fund-manager-mapping.component.scss',
})
export class FundManagerMappingComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() sideFormController = new EventEmitter<any>();
  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns: string[] = [
    'srno',
    'Fund Manager',
    'L1 Scheme',
    'Joining Date',
    'End Date',
  ];
  protected addIcon = faPlus;
  protected filterIcon = faFilter;

  constructor(private apiService: ApiService) {}

  public getMappingDetails(formData: any) {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.FundMappingDetail,
        'getMappingDetails',
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

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected addFundMngDetailModal() {
    const params = {
      action: 'add',
    };
    this.sideFormController.emit(params);
  }

  protected editFundMngDetailModal(fundMngDetailData?: any) {
    const params = {
      action: 'edit',
      payload: fundMngDetailData,
    };
    this.sideFormController.emit(params);
  }

  protected filterController() {
    const params = {
      action: 'filter',
    };
    this.sideFormController.emit(params);
  }
}
