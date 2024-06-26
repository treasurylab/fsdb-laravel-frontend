import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import {
  faCloudArrowDown,
  faFilter,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cd-curve',
  templateUrl: './cd-curve.component.html',
  styleUrls: ['./cd-curve.component.scss'],
})
export class CdCurveComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected miborrateList = new MatTableDataSource<any>();
  protected cdCurveformdata: any = [];
  protected tableChips: string[] = [];

  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected pageInfo = {
    title: 'CD Curve(India)',
    content:
      'FBIL announces the benchmark rates for Certificates of Deposit ( FBIL-CD) on a daily basis except Saturdays, Sundays and public holidays at 5.30 PM. FBIL has developed the FBIL- CD, a new benchmark for the money market based on traded CDs reported on the FTRAC platform of CCIL up to 5 PM. All trades having a value of Rs.5 crores and above and a minimum of three trades in each tenor are considered for calculating the benchmark for each tenor. In the event of the threshold criteria not being met for any tenor, the benchmark rate thereof is calculated using the FBIL- TBILL rates for that tenor plus a spread.',
  };

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe,
    protected dialog: MatDialog
  ) {}

  protected cdCurveRate = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });

  ngOnInit() {
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.cdCurveRate!.get('fromdate')!.setValue(formattedDate);
    this.cdCurveRate!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getCDRateList();
  }

  displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];
  displayedColumnDW2 = [
    // 'no',
    'rdate',
    'd14s',
    'r1m',
    'r2m',
    'r3m',
    `r6m`,
    `r9m`,
    `r1y`,
  ];

  protected getCdrateDownload() {
    this.cdCurveformdata = this.cdCurveRate.value;
    if (!isNaN(Date.parse(this.cdCurveformdata.fromdate))) {
      this.cdCurveformdata.fromdate = new Date(this.cdCurveformdata.fromdate);
      this.cdCurveformdata.fromdate = this.datePipe.transform(
        this.cdCurveformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.cdCurveformdata.selectedOption == 'B') {
        this.cdCurveformdata.todate = new Date(this.cdCurveformdata.todate);
        this.cdCurveformdata.todate = this.datePipe.transform(
          this.cdCurveformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.cdCurveformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.cdCurveformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.cdCurveformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.cdCurveformdata.fromdate,
            'dd.MM.yyyy'
          )}`
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.cdCurveformdata.todate,
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
        'getCdRates',
        this.cdCurveformdata
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

  protected getCDRateList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getCdRates')
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

  exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      rdate: 'Record Date',
      rtype: 'Record Type',
      d14s: '14 Days',
      r1m: '1 Month',
      r2m: '2 Months',
      r3m: '3 Months',
      r6m: '6 Months',
      r9m: '9 Months',
      r1y: '12 Months',
      // record_date: 'Date',
    };

    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {};
      for (const key in row) {
        if (
          key === 'd1' ||
          key === 'r4m' ||
          key === 'r5m' ||
          key === 'r7m' ||
          key === 'r8m' ||
          key === 'r10m' ||
          key === 'r11m' ||
          key === 'r2y' ||
          key === 'r3y' ||
          key === 'r5y' ||
          key === 'r10y' ||
          key === 'cid' ||
          key === 'rdatetime' ||
          key === 'rjson' ||
          key === 'Date' ||
          key === 'record_date'
        ) {
          continue; // Skip these columns
        }
        if (headerMapping.hasOwnProperty(key)) {
          newRow[headerMapping[key]] = row[key];
        } else {
          newRow[key] = row[key];
        }
      }
      return newRow;
    });

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
