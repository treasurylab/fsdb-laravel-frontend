import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { Chart } from 'chart.js';
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
  selector: 'app-tonar',
  templateUrl: './tonar.component.html',
  styleUrls: ['./tonar.component.scss'],
})
export class TonarComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  protected tonarrateList: any = [];
  protected tonarformdata: any = [];
  protected tableChips: string[] = [];
  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected pageInfo = {
    title: 'TONAR',
    content:
      "The Tokyo Overnight Average Rate (TONAR) is the risk-free unsecured interbank overnight interest rate for the Japanese Yen - it's also known as TONA. The TONAR interest rate is calculated by taking a volume-weighted average of all uncollateralised overnight transactions settled on the same day as the trade date, but that mature the following business day.",
  };
  protected displayedColumn1 = [
    // 'srno',
    'date',
    'avg',
    'max',
    'min',
  ];
  protected tonarRateForm = new FormGroup({
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
    this.tonarRateForm!.get('fromdate')!.setValue(formattedDate);
    this.tonarRateForm!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.gettonarrateList();
  }

  protected getTonarRate() {
    this.tonarformdata = this.tonarRateForm.value;
    if (!isNaN(Date.parse(this.tonarformdata.fromdate))) {
      this.tonarformdata.fromdate = new Date(this.tonarformdata.fromdate);
      this.tonarformdata.fromdate = this.datePipe.transform(
        this.tonarformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.tonarformdata.selectedOption === 'B') {
        this.tonarformdata.todate = new Date(this.tonarformdata.todate);
        this.tonarformdata.todate = this.datePipe.transform(
          this.tonarformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.tonarformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.tonarformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.tonarformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.tonarformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          `To Date: ${this.datePipe.transform(
            this.tonarformdata.todate,
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
        'getTonarRate',
        this.tonarformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.tonarrateList = data['data'];
          this.dataSource = new MatTableDataSource(this.tonarrateList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (_) => {
          alert('An error occurred while fetching data from the server.');
        },
      });
  }

  private gettonarrateList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getTonarRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.tonarrateList = data['data'];
          this.dataSource = new MatTableDataSource(this.tonarrateList);
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
      avg: 'Avg (%)',
      max: 'Max (%)',
      min: 'Min (%)',
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
