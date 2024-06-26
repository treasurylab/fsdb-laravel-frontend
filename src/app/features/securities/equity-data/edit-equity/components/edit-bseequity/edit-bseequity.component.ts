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
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { AddBseIsinComponent } from './components/add-bse-isin/add-bse-isin.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-bseequity',
  templateUrl: './edit-bseequity.component.html',
  styleUrl: './edit-bseequity.component.scss',
})
export class EditBSEEquityComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() sideNavObj!: SideFormComponent;
  @Output() sideFormController = new EventEmitter<{
    action: string;
    payload: object | undefined;
  }>();
  protected addIcon = faPlus;
  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns = [
    'isin',
    'symbol',
    'company',
    'sensex50',
    'sensex200',
    'status',
  ];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBseISINList();
  }

  public getBseISINList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.equity,
        'getBseISINList'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.dataSource = new MatTableDataSource(data['data']);
            this.dataSource.paginator = this.paginator;
          }
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

  protected openAddbseIsinModel() {
    this.dialog.open(AddBseIsinComponent);
  }
}
