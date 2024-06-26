import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  faCloudArrowDown,
  faEraser,
  faFilter,
  faLink,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-corporate-action',
  templateUrl: './corporate-action.component.html',
  styleUrls: ['./corporate-action.component.scss'],
})
export class CorporateActionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.corporateActionRateList.paginator = this.paginator;
  }
  protected corporateInfo = {
    title: 'Corporate Action',
    content:
      'Corporate actions provided by the NSE on daily basis. A corporate action is any action taken by a company - generally enacted by its board of directors - that has a material impact on the company and its shareholders.',
  };
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected selectedOption: string = 'A';
  protected fromDate: any;
  protected sdate: any;
  protected keyDate: any;
  protected toDate: any;
  protected endDate: any;
  protected fromDateD: any;
  protected exportCorporateAction: boolean = false;
  protected corporateActionRateList = new MatTableDataSource<any>();
  protected caFormdata: any = [];
  protected cgrp: any;
  protected datediff: any;
  protected CARateList: any;
  protected tableChips: string[] = [];

  protected corporatActionformData = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });

  protected displayedColumns = [
    'date',
    'symbol',
    'company_name',
    'series',
    'facevalue',
    'purpose',
    'exdate',
    'newshare',
    'oldshare',
    'dividend',
    'premium',
    'prev_fv',
    'next_fv',
  ];
  data: any = [];

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
    this.corporatActionformData!.get('fromdate')!.setValue(formattedDate);
    this.corporatActionformData!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getCARateList();
  }

  private getCARateList() {
    this.apiService
      .getRequestLegacy(FeatureList.equity, 'getCorporateActionDataList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.corporateActionRateList.data = data['data']['data']; // Assign data to .data property
          this.exportCorporateAction = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getCorporateActionData() {
    this.caFormdata = this.corporatActionformData.value;
    if (!isNaN(Date.parse(this.caFormdata.fromdate))) {
      this.caFormdata.fromdate = new Date(this.caFormdata.fromdate);
      this.caFormdata.fromdate = this.datePipe.transform(
        this.caFormdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.caFormdata.selectedOption === 'B') {
        this.caFormdata.todate = new Date(this.caFormdata.todate);
        this.caFormdata.todate = this.datePipe.transform(
          this.caFormdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.caFormdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.caFormdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.caFormdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.caFormdata.fromdate,
            'dd.MM.yyyy'
          )}`
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.caFormdata.todate,
            'dd.MM.yyyy'
          )}`
        );
      }
    } else {
      console.log('Date not valid');
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'getCorporateActionData',
        this.caFormdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.corporateActionRateList.data = data['data']['data'];
          this.corporateActionRateList.paginator = this.paginator;
          this.exportCorporateAction = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      sdate: 'Date',
      symbol: 'Symbol',
      company_name: 'Company Name',
      series: 'Series',
      face_value: 'Face Value',
      purpose: 'Purpose',
      ex_date: 'Ex Date',
      record_date: 'Record Date',
      new_share: 'New Share',
      old_share: 'Old Share',
      div_val: 'Dividend Value',
      premium: 'Premium',
      pre_fv: 'Previous Face Value',
      next_fv: 'Next Face Value',
    };

    const customizedRatelist = ratelist.data.map(
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

    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
