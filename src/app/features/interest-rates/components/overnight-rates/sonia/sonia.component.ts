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
  selector: 'app-sonia',
  templateUrl: './sonia.component.html',
  styleUrls: ['./sonia.component.scss'],
})
export class SoniaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  protected soniaRateList: any = [];
  protected soniaformdata: any = [];
  protected tableChips: string[] = [];
  protected exportIcon = faCloudArrowDown;
  protected filterIcon = faFilter;
  protected linkIcon = faLink;
  protected soniaRateForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });
  protected pageInfo = {
    title: 'SONIA',
    content:
      'The Sterling Overnight Index Average (SONIA) rate is an interest rate benchmark used in the United Kingdom. It is the effective overnight interest rate paid by banks for unsecured transactions in the British sterling market. Administered by the Bank of England (BoE), SONIA is used to fund trades that occur overnight during off-hours.',
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
    this.soniaRateForm!.get('fromdate')!.setValue(formattedDate);
    this.soniaRateForm!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getsoniarateList();
  }

  displayedColumn1 = [
    // 'srno',
    'date',
    'avgrate',
  ];

  getSoniaRate() {
    this.soniaformdata = this.soniaRateForm.value;
    if (!isNaN(Date.parse(this.soniaformdata.fromdate))) {
      this.soniaformdata.fromdate = new Date(this.soniaformdata.fromdate);
      this.soniaformdata.fromdate = this.datePipe.transform(
        this.soniaformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.soniaformdata.selectedOption === 'B') {
        this.soniaformdata.todate = new Date(this.soniaformdata.todate);
        this.soniaformdata.todate = this.datePipe.transform(
          this.soniaformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.soniaformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.soniaformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.soniaformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.soniaformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.soniaformdata.todate,
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
        'getSoniaRate',
        this.soniaformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.soniaRateList = data['data'];
          this.dataSource = new MatTableDataSource(this.soniaRateList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (_) => {
          alert('An error occurred while fetching data from the server.');
        },
      });
  }

  clearForm() {
    this.soniaRateForm.reset();
  }

  getsoniarateList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getSoniaRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.soniaRateList = data['data'];
          this.dataSource = new MatTableDataSource(this.soniaRateList);
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
      avgrate: 'Average Rate',
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
