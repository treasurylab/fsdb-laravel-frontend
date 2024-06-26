import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  faCloudArrowDown,
  faFilter,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mifor-rates',
  templateUrl: './mifor-rates.component.html',
  styleUrls: ['./mifor-rates.component.scss'],
})
export class MiforRatesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  miforrateList = new MatTableDataSource<any>();
  miforformdata: any = [];
  protected tableChips: string[] = [];

  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected pageInfo = {
    title: 'MIFOR',
    content:
      " FBIL announces the benchmark rates for MIFOR for three tenors of 14-day, 1-month and 3-month on a daily basis except Saturdays, Sundays and public holidays. The benchmark rates are determined through a polling-based submission by the participating banks and Primary Dealers [PDs] out of the FBIL's list of identified submitters. The CCIL acts as the Calculating Agent. The rates are announced at 11.45 AM every day. However, if the rate submission time is extended due to non-fulfillment of threshold criteria, the dissemination time may get suitably extended.",
  };
  protected mifor = new FormGroup({
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
    this.mifor!.get('fromdate')!.setValue(formattedDate);
    this.mifor!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getMiforList();
  }

  displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];

  displayedColumnDW3 = ['date', 'on', 'm1', 'm2', 'm3', 'm6', 'm12'];

  protected getMiforList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getMiforRates')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miforrateList.data = data['data'];
          this.miforrateList.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getMiforDownload() {
    this.miforformdata = this.mifor.value;

    if (!isNaN(Date.parse(this.miforformdata.fromdate))) {
      this.miforformdata.fromdate = new Date(this.miforformdata.fromdate);
      this.miforformdata.fromdate = this.datePipe.transform(
        this.miforformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.miforformdata.selectedOption == 'A') {
        this.miforformdata.todate = new Date(this.miforformdata.todate);
        this.miforformdata.todate = this.datePipe.transform(
          this.miforformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.miforformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.miforformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.miforformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.miforformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.miforformdata.todate,
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
        'getMiforRates',
        this.miforformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miforrateList.data = data['data'];
          this.miforrateList.paginator = this.paginator;
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
      on: 'O/N',
      m1: '1 Month',
      m2: '2 Month',
      m3: '3 Months',
      m6: '6 Months',
      m12: '12 Months',
    };

    const customizedRatelist = this.miforrateList.data.map(
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

    this.exportService.downloadFile(customizedRatelist, 'MIFOR_RATES');
  }
}
