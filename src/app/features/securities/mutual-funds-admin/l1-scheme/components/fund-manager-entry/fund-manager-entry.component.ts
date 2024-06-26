import { ApiService } from 'src/app/shared/services/api/api.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';

@Component({
  selector: 'app-fund-manager-entry',
  templateUrl: './fund-manager-entry.component.html',
  styleUrl: './fund-manager-entry.component.scss',
})
export class FundManagerEntryComponent implements OnInit {
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Output() sideFormController = new EventEmitter<{
    action: string;
    payload?: { fundmng_id: string; fundmng_name: string };
  }>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected dataSource = new MatTableDataSource<any>();
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected deleteIcon = faTrash;

  protected displayedColumns = ['srno', 'Fund Manager Name', 'action'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getFundManagerDetails();
  }

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected addFundMngModal() {
    const params = {
      action: 'add',
    };
    this.sideFormController.emit(params);
  }

  protected editFundMngModal(fundMngData?: any) {
    const params = {
      action: 'edit',
      payload: {
        fundmng_id: fundMngData.fundmng_id as string,
        fundmng_name: fundMngData.fundmng_name as string,
      },
    };
    this.sideFormController.emit(params);
  }

  protected deleteFundManagerDetails(element: any) {
    const requestParams = {
      id: element.fundmng_id,
    };
    if (confirm('Are you sure to delete this item?')) {
      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.FundManagerDetails,
          'deleteFundManagerDetails',
          requestParams
        )
        .pipe(first())
        .subscribe({
          next: (_) => {
            alert('Asset Type Deleted');
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  public getFundManagerDetails() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.FundManagerDetails,
        'getFundManagerDetails'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.dataSource.data = data['data'];
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
