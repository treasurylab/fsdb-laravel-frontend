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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ester',
  templateUrl: './ester.component.html',
  styleUrls: ['./ester.component.scss'],
})
export class EsterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  protected tableChips: string[] = [];
  esterRateList: any = [];
  esterformdata: any = [];
  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected esterRateForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });
  protected pageInfo = {
    title: 'ESTER',
    content:
      'ESTER is short for Euro Short-Term Rate. The ESTER rate (also called ESTR or €STR) is the 1-day interbank interest rate for the Euro zone. In other words, it is the average rate at which a group of financial institions provide loans to each other with a duration of 1 day. ESTER is published by the European Central Bank and has replaced the Eonia interest rate.',
  };

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.esterRateForm!.get('fromdate')!.setValue(formattedDate);
    this.esterRateForm!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getEsterRateList();
  }

  displayedColumn1 = [
    // 'srno',
    'date',
    'rate',
  ];

  protected getEsterRate() {
    this.esterformdata = this.esterRateForm.value;
    if (!isNaN(Date.parse(this.esterformdata.fromdate))) {
      this.esterformdata.fromdate = new Date(this.esterformdata.fromdate);
      this.esterformdata.fromdate = this.datePipe.transform(
        this.esterformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.esterformdata.selectedOption === 'B') {
        this.esterformdata.todate = new Date(this.esterformdata.todate);
        this.esterformdata.todate = this.datePipe.transform(
          this.esterformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.esterformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.esterformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.esterformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.esterformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.esterformdata.todate,
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
        'getEsterRate',
        this.esterformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.esterRateList = data['data'];
          this.dataSource = new MatTableDataSource(this.esterRateList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (_) => {
          alert('An error occurred while fetching data from the server.');
        },
      });
  }

  private getEsterRateList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getEsterRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.esterRateList = data['data'];
          this.dataSource = new MatTableDataSource(this.esterRateList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (_) => {
          alert('An error occurred while fetching data from the server.');
        },
      });
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      record_date: 'Record Date',
      avg: 'Rate (%)',
      // Add more mappings as needed
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
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
