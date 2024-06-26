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

@Component({
  selector: 'app-add-edit-lone-scheme',
  templateUrl: './add-edit-lone-scheme.component.html',
  styleUrl: './add-edit-lone-scheme.component.scss',
})
export class AddEditLoneSchemeComponent implements OnInit {
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
    'L1 Scheme Name',
    'Link Symbol',
    'Category',
    'BP ID',
    'Fund House',
    'Sebi Category',
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchLOneList();
  }

  public fetchLOneList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'fetchLOneList'
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

  protected addEditLoneSchemeModel(action: string, loneSchemeData?: object) {
    const params = {
      action: action,
      payload: loneSchemeData,
    };
    this.sideFormController.emit(params);
  }
}
