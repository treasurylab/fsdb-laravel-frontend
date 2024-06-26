import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatTableDataSource } from '@angular/material/table';
import {
  faCloudArrowDown,
  faFilter,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-rbi-rates',
  templateUrl: './rbi-rates.component.html',
  styleUrls: ['./rbi-rates.component.scss'],
})
export class RbiRatesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected selectedOption: string = 'A';
  protected rbirateList!: MatTableDataSource<any>;
  protected rbilformdata: any = [];
  protected cgrpId?: string | null;
  protected displayedColumnDW!: Array<string>;
  protected tableChips: string[] = [];

  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected pageInfo = {
    title: 'RBI Rates',
    content:
      'Different Rates provided by RBI every Friday for the previous week.',
  };

  protected rbireporate = new FormGroup({
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

  ngOnInit(): void {
    this.pageSetup();
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.rbireporate!.get('fromdate')!.setValue(formattedDate);
    this.rbireporate!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getRBIRateList();
  }

  private pageSetup() {
    this.rbirateList = new MatTableDataSource<any>();
    this.cgrpId = localStorage.getItem('cgrp_id');
    if (this.cgrpId !== '28') {
      this.displayedColumnDW = [
        'date',
        'tbill92',
        'tbill182',
        'tbill364',
        'reporate',
        'reverseReporate',
        'mclronhigh',
        'mclronlow',
        'gsec10yrate',
      ];
    } else {
      this.displayedColumnDW = ['date', 'reporate', 'reverseReporate'];
    }
  }

  protected getRBIRateList() {
    this.rbilformdata = this.rbireporate.value;
    if (!isNaN(Date.parse(this.rbilformdata.fromdate))) {
      this.rbilformdata.fromdate = new Date(this.rbilformdata.fromdate);
      this.rbilformdata.fromdate = this.datePipe.transform(
        this.rbilformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.rbilformdata.selectedOption === 'B') {
        this.rbilformdata.todate = new Date(this.rbilformdata.todate);
        this.rbilformdata.todate = this.datePipe.transform(
          this.rbilformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.rbilformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.rbilformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.rbilformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.rbilformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.rbilformdata.todate,
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
        'getRbiReporate',
        this.rbilformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.rbirateList.data = data['data'];
          this.rbirateList.paginator = this.paginator;
          console.log(this.rbirateList);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      rdate: 'Record Date',
      tbill92: 'T-Bill 91',
      tbill182: 'T-Bill 182',
      tbill364: 'T-Bill 364',
      reporate: 'Repo Rate',
      revreporate: 'Reverse Repo Rate',
      mclronhigh: 'MCLR O/N High',
      mclronlow: 'MCLR O/N Low',
      gsec10yrate: 'G-Sec 10Y Rate',

      // Add more mappings as needed
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {};
      for (const key in row) {
        if (key === 'record_date') {
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
