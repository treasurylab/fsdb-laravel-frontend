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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mibor-term',
  templateUrl: './mibor-term.component.html',
  styleUrls: ['./mibor-term.component.scss'],
})
export class MiborTermComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected miborformdata: any = [];
  protected miborrateTermListDataSource = new MatTableDataSource<any>();
  protected tableChips: string[] = [];

  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected pageInfo = {
    title: 'Term MIBOR',
    content:
      "FBIL announces the benchmark rates for Term MIBOR for three tenors of 14-day, 1-month and 3-month on a daily basis except Saturdays, Sundays and public holidays. The benchmark rates are determined through a polling-based submission by the participating banks and Primary Dealers [PDs] out of the FBIL's list of identified submitters. The CCIL acts as the Calculating Agent. The rates are announced at 11.45 AM every day. However, if the rate submission time is extended due to non-fulfillment of threshold criteria, the dissemination time may get suitably extended.",
  };

  protected miborterm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });

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
    this.miborterm!.get('fromdate')!.setValue(formattedDate);
    this.miborterm!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getTermMiborList();
  }

  displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];

  displayedColumnDW3 = ['date', '14days', '1month', '3month'];

  private getTermMiborList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getTermMiborList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateTermListDataSource.data = data['data'];
          this.miborrateTermListDataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getMiborTermDownload() {
    this.miborformdata = this.miborterm.value;

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
          `To Date: ${this.datePipe.transform(
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
        'getTermMiborList',
        this.miborformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateTermListDataSource.data = data['data'];
          this.miborrateTermListDataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv() {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      d14: '14 Days',
      m1: '1 Month',
      m3: '3 Months',
    };

    const customizedRatelist = this.miborrateTermListDataSource.data.map(
      (row: { [key: string]: any }) => {
        const newRow: { [key: string]: any } = {};
        for (const key in row) {
          if (key === 'on') {
            continue;
          }
          if (headerMapping.hasOwnProperty(key)) {
            newRow[headerMapping[key]] = row[key];
          } else {
            newRow[key] = row[key];
          }
        }
        return newRow;
      }
    );

    this.exportService.downloadFile(customizedRatelist, 'MIBOR_RATES');
  }
}
