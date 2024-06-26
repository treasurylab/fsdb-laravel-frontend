import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { MatPaginator } from '@angular/material/paginator';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-fund-house',
  templateUrl: './edit-fund-house.component.html',
  styleUrls: ['./edit-fund-house.component.scss'],
})
export class EditFundHouseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() sideNavObj!: SideFormComponent;
  @Output() sideFormController = new EventEmitter<{
    action: string;
    payload: object | undefined;
  }>();
  protected addIcon = faPlus;
  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns = [
    'srno',
    'id',
    'name',
    'symbol',
    'sname',
    'cdate',
  ];
  types: any;
  params: string | undefined;
  listbp: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fundHouseProductList();
  }

  fundHouseProductList() {
    this.params = 'FUNDHSG';
    const requestParams = {
      id: this.params,
    };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'fundHouseProductList',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.listbp = data['data'];
            this.dataSource = new MatTableDataSource(this.listbp);
            this.dataSource!.paginator = this.paginator;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  closeNav() {
    this.sideNavObj.toggleFormNav();
  }

  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected addEditFundHouseModel(action: string, fundHouseData?: object) {
    const params = {
      action: action,
      payload: fundHouseData,
    };
    this.sideFormController.emit(params);
  }
}
