import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import {
  faCloudArrowDown,
  faFilter,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mibor-ois',
  templateUrl: './mibor-ois.component.html',
  styleUrls: ['./mibor-ois.component.scss'],
})
export class MiborOisComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  miborrateList = new MatTableDataSource<any>();
  protected miborformdata: any = [];

  protected tabList = ['Key Date', 'Range'];
  protected activeTab = 'Key Date';
  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected tableChips: string[] = [];
  protected pageInfo = {
    title: 'MIBOR OIS Rates',
    content:
      'FBIL announces the benchmark rates for MIBOR-OIS for tenors from 1 month to 5 years on a daily basis except Saturday, Sunday and public holidays.The benchmark rates for 1 month, 2 months, 3 months, 6 months, 9 months, 1 year, 2 years, 3 years, 4 years and 5 years tenors are calculated based on the MIBOR-OIS transactions data reported to the CCIL upto 5 PM. The rate for each tenor is calculated as the volume weighted average rate of the surviving trades after removing the outliers. The rates are published upto two decimal points. The CCIL is the calculating agent. The rates are published by 5.45 PM.',
  };

  protected miborrate = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });

  protected displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];
  protected displayedColumnDW2 = [
    'date',
    'm1',
    'm2',
    'm3',
    'm6',
    'm9',
    'y1',
    'y2',
    'y3',
    'y4',
    'y5',
  ];

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe,
    protected dialog: MatDialog
  ) {}

  ngOnInit() {
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.miborrate!.get('fromdate')!.setValue(formattedDate);
    this.miborrate!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getMiborOisRateList();
  }

  private getMiborOisRateList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getOisMiborList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateList.data = data['data'];
          this.miborrateList.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getMiboroisDownload() {
    this.miborformdata = this.miborrate.value;
    if (!isNaN(Date.parse(this.miborformdata.fromdate))) {
      this.miborformdata.fromdate = new Date(this.miborformdata.fromdate);
      this.miborformdata.fromdate = this.datePipe.transform(
        this.miborformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.miborformdata.selectedOption === 'B') {
        this.miborformdata.todate = new Date(this.miborformdata.todate);
        this.miborformdata.todate = this.datePipe.transform(
          this.miborformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.miborformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.miborformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.miborformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.miborformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.miborformdata.todate,
            'dd.MM.yyyy'
          )}`
        );
      }
    } else {
      console.log('Date not valid');
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getOisMiborList',
        this.miborformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateList.data = data['data'];
          this.miborrateList.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv() {
    const headerMapping: { [key: string]: string } = {
      record_date: 'Record Date',
      m1: '1 Month',
      m2: '2 Months',
      m3: '3 Months',
      m6: '6 Months',
      m9: '9 Months',
      y1: '1 Year',
      y2: '2 Years',
      y3: '3 Years',
      y4: '4 Years',
      y5: '5 Years',
    };

    const customizedRatelist = this.miborrateList.data.map(
      (row: { [key: string]: any }) => {
        const newRow: { [key: string]: any } = {};
        for (const key in row) {
          if (headerMapping.hasOwnProperty(key)) {
            newRow[headerMapping[key]] = row[key];
          } else {
            newRow[key] = row[key];
          }
        }
        return newRow;
      }
    );

    this.exportService.downloadFile(customizedRatelist, 'MIBOROIS_RATES');
  }

  protected openModal() {
    this.dialog.open(InfoModalComponent, {
      panelClass: 'custom-mat-dialog',
      data: {
        title: 'MIBOR OIS Rates',
        content:
          ' FBIL announces the benchmark rates for MIBOR-OIS for tenors from 1 month to 5 years on a daily basis except Saturday, Sunday and public holidays.The benchmark rates for 1 month, 2 months, 3 months, 6 months, 9 months, 1 year, 2 years, 3 years, 4 years and 5 years tenors are calculated based on the MIBOR-OIS transactions data reported to the CCIL upto 5 PM. The rate for each tenor is calculated as the volume weighted average rate of the surviving trades after removing the outliers. The rates are published upto two decimal points. The CCIL is the calculating agent. The rates are published by 5.45 PM.',
      },
    });
  }
}
