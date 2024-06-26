import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatDialog } from '@angular/material/dialog';
import { AddNseIsinComponent } from './components/add-nse-isin/add-nse-isin.component';

@Component({
  selector: 'app-edit-nseequity',
  templateUrl: './edit-nseequity.component.html',
  styleUrl: './edit-nseequity.component.scss',
})
export class EditNSEEquityComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  protected sideFormTitle = '';
  protected sideFormSubTitle = '';
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected viewIcon = faEye;
  protected deleteIcon = faTrash;
  protected dataSource = new MatTableDataSource<any>();
  protected equityList: string[] = [];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.getEquityList();
  }
  displayedColumns = [
    'isin',
    'symbol',
    'company',
    'nifty50',
    'nifty200',
    'status',
  ];
  openAddIsinModel() {
    this.dialog.open(AddNseIsinComponent);
  }

  addEditFundHouseModel(action: string, data: string) {}
  applyFilter(event: Event) {}

  getEquityList() {
    this.apiService
      .getRequestLegacy(FeatureList.equity, 'getNSEEquityList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.equityList = data['data'];
          this.dataSource = new MatTableDataSource(this.equityList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
