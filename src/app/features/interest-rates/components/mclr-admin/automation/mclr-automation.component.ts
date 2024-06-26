import { FeatureList } from './../../../../../../features';
import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { EditMclrUrlComponent } from './edit-mclr-url/edit-mclr-url.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-fsmclrautodata',
  templateUrl: './mclr-automation.component.html',
  styleUrls: ['./mclr-automation.component.scss'],
})
export class MclrAutomationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns: string[] = [
    'srno',
    'Bank Code',
    'Bank Name',
    'viewAction',
    'Effective Date',
    'Status',
    'Created By',
    'Created Date',
  ];
  private currentYear = new Date().getFullYear();
  protected finYearOptions = Array(9)
    .fill(0)
    .map((_, idx) => this.currentYear - 7 + idx);
  protected monthOptions = [
    { mrmid: 1, name: 'Jan' },
    { mrmid: 2, name: 'Feb' },
    { mrmid: 3, name: 'Mar' },
    { mrmid: 4, name: 'Apr' },
    { mrmid: 5, name: 'May' },
    { mrmid: 6, name: 'June' },
    { mrmid: 7, name: 'Jul' },
    { mrmid: 8, name: 'Aug' },
    { mrmid: 9, name: 'Sep' },
    { mrmid: 10, name: 'Oct' },
    { mrmid: 11, name: 'Nov' },
    { mrmid: 12, name: 'Dec' },
  ];
  protected aumFundForm = new FormGroup({
    finYear: new FormControl(''),
    month: new FormControl(''),
  });
  protected searchIcon = faSearch;
  protected filterIcon = faFilter;
  dataList: any;

  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit() {
    this.getMclrBankLinkList();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.aumFundForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getMclrBankLinkList() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getMclrBankLinkList',
        this.aumFundForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          // this.dataSource = data['data'];
          this.dataList = data['data'];
          this.dataSource = new MatTableDataSource(this.dataList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected openUrlDialog(data: any, mode: string) {
    this.dialog.open(EditMclrUrlComponent, {
      panelClass: 'custom-mat-dialog',
      data: { mode: mode, bankInfo: data },
    });
  }
}
