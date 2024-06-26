import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

export interface fyyear {
  id: any;
  name: string;
}
export interface fyyear1 {
  id: any;
  name: string;
}

export interface fyquarter {
  id: any;
  name: string;
}
export interface allmonth {
  id: any;
  name: string;
}

@Component({
  selector: 'app-market-capital',
  templateUrl: './market-capital.component.html',
  styleUrls: ['./market-capital.component.scss'],
})
export class MarketCapitalComponent implements OnInit {
  montlyaum: any = [];
  params: any;
  aumFormParams: any;
  aumMonthParams: any;

  aumParam: any = [];
  pullDataAum: any = [];
  avaFundHouse: any = [];
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();

  addMarketDataMode: boolean = false;
  marketdata: any;
  formValues: any;
  data: any;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private exportService: ExportService
  ) {}

  displayedColumns1: string[] = [
    'srno',
    'Symbol',
    'Company Name',
    'Issued Capital',
    'action',
  ];

  fyyears: fyyear[] = [
    { id: 2025, name: '2025' },
    { id: 2024, name: '2024' },
    { id: 2023, name: '2023' },
    { id: 2022, name: '2022' },
    { id: 2021, name: '2021' },
    { id: 2020, name: '2020' },
    { id: 2019, name: '2019' },
    { id: 2018, name: '2018' },
    { id: 2017, name: '2017' },
  ];

  allmonths: allmonth[] = [
    { id: '01', name: 'Jan' },
    { id: '02', name: 'Feb' },
    { id: '03', name: 'Mar' },
    { id: '04', name: 'Apr' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'Jul' },
    { id: '08', name: 'Aug' },
    { id: '09', name: 'Sep' },
    { id: '10', name: 'Oct' },
    { id: '11', name: 'Nov' },
    { id: '12', name: 'Dec' },
  ];

  marketcapform: FormGroup = new FormGroup({
    fyyears: new FormControl(''),
    allmonths: new FormControl(''),
  });

  ngOnInit() {}

  protected getFormControllers(name: string) {
    const ctrl = this.marketcapform.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getMarketCap() {
    this.aumMonthParams = this.marketcapform.value;
    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'getMarketCapital',
        this.aumMonthParams
      )
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          if (response != null) {
            this.montlyaum = response['data'];
            this.dataSource2 = new MatTableDataSource(this.montlyaum);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  saveMarketCap(element: any) {
    const formValues = {
      selectedYear: this.marketcapform.get('fyyears')?.value,
      selectedMonth: this.marketcapform.get('allmonths')?.value,
      companyName: element.company_name,
      updatedMarketCap: element.market_cap,
      isin: element.isin_no,
      symbol: element.symbol,
    };

    this.marketdata = formValues;
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'addMarketCap', this.marketdata)
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          this.data = response;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  exportToCsv(montlyaum: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      company_name: 'Company Name',
      isin_no: 'Company',
      symbol: 'Symbol',
      market_cap: 'Issued Capital',
      // Add more mappings as needed
    };

    const customizedRatelist = montlyaum.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {};
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

  addMarketData() {}
}
