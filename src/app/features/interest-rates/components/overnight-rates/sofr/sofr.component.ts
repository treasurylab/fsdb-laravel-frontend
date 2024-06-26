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
  selector: 'app-sofr',
  templateUrl: './sofr.component.html',
  styleUrls: ['./sofr.component.scss'],
})
export class SofrComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();

  protected sofrrateList: any = [];
  protected sofrformdata: any = [];
  protected tableChips: string[] = [];
  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected sofrRateForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });
  protected pageInfo = {
    title: 'SOFR',
    content:
      ' The Secured Overnight Financing Rate (SOFR) is a broad measure of the cost of borrowing cash overnight collateralized by Treasury securities. The SOFR includes all trades in the Broad General Collateral Rate plus bilateral Treasury repurchase agreement (repo) transactions cleared through the Delivery-versus-Payment (DVP) service offered by the Fixed Income Clearing Corporation (FICC), which is filtered to remove a portion of transactions considered “specials”.',
  };

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
    this.sofrRateForm!.get('fromdate')!.setValue(formattedDate);
    this.sofrRateForm!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getsofrrateList();
  }

  displayedColumn1 = [
    // 'srno',
    'date',
    'rate',
    'day30',
    'day90',
    'day180',
  ];

  protected getSofrRate() {
    this.sofrformdata = this.sofrRateForm.value;
    if (!isNaN(Date.parse(this.sofrformdata.fromdate))) {
      this.sofrformdata.fromdate = new Date(this.sofrformdata.fromdate);
      this.sofrformdata.fromdate = this.datePipe.transform(
        this.sofrformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.sofrformdata.selectedOption == 'A') {
        this.sofrformdata.todate = new Date(this.sofrformdata.todate);
        this.sofrformdata.todate = this.datePipe.transform(
          this.sofrformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.sofrformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.sofrformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.sofrformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.sofrformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.sofrformdata.todate,
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
        'getSofrRate',
        this.sofrformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sofrrateList = data['data'];
          this.dataSource = new MatTableDataSource(this.sofrrateList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (_) => {
          alert('An error occurred while fetching data from the server.');
        },
      });
  }

  protected getsofrrateList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getSofrRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sofrrateList = data['data'];
          // Set data source for MatTableDataSource
          this.dataSource = new MatTableDataSource(this.sofrrateList);
          // Connect MatTableDataSource to MatPaginator
          this.dataSource.paginator = this.paginator;
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
      rate: 'Rate',
      day30avg: '30-DAY AVERAGE (%)',
      day90avg: '90-DAY AVERAGE (%)',
      day180avg: '180-DAY AVERAGE (%)',

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
