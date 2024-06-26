import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faLink,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-equity-nse',
  templateUrl: './equity-nse.component.html',
  styleUrls: ['./equity-nse.component.scss'],
})
export class EquityNse implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.mtmHistRates.paginator = this.paginator;
  }
  protected nseInfo = {
    title: 'Equity Closing Prices (NSE)',
    content:
      'NSE provides Bhav copy files on every working day after market close.',
  };
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected tabs = ['Key Date', 'Range'];
  protected activeTab = 'Key Date';
  protected mtmHistRates!: MatTableDataSource<any>;
  protected displayedColumns!: Array<string>;
  protected cgrpId?: string | null;
  protected dropDownCompanies: any[] = [];
  protected tableChips: string[] = [];
  protected niftyOption = [
    { id: 'nifty50', value: 'Nifty 50' },
    { id: 'nifty200', value: 'Nifty 200' },
  ];

  protected searchKey: string = '';
  protected currentDate?: string;
  protected queryForm!: FormGroup;
  protected showLastDate = true;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private exportService: ExportService,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pageSetup();
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.queryForm = this.formBuilder.group({
      selectedOption: ['A', Validators.required],
      fromDate: [formattedDate, Validators.required],
      toDate: [formattedDate],
      niftyOption: [this.cgrpId === '28' ? 'eqList' : 'nifty50'],
      company: ['All'],
    });
    this.queryForm.valueChanges.subscribe(() => {
      this.updateTableChips();
    });
    this.getAllMappedCompanies();
    if (this.cgrpId !== '28') {
      this.getMtmHistRates();
      this.queryForm.get('niftyOption')?.valueChanges.subscribe((_) => {
        this.getAllMappedCompanies();
      });
    } else {
      this.getEQClosingPriceList();
    }
    this.updateTableChips();
  }

  protected onTabChange(event: string): void {
    this.activeTab = event;
    if (event === this.tabs[0]) {
      this.queryForm.patchValue({
        selectedOption: 'A',
      });
    } else {
      this.queryForm.patchValue({
        selectedOption: 'B',
      });
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.queryForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private pageSetup() {
    this.mtmHistRates = new MatTableDataSource<any>();
    this.cgrpId = localStorage.getItem('cgrp_id');
    if (this.cgrpId !== '28') {
      this.displayedColumns = [
        'date',
        'symbol',
        'isin_no',
        'open',
        'high',
        'low',
        'close',
        'prevclose',
        // 'marketcapital',
      ];
    } else {
      this.displayedColumns = [
        'date',
        'symbol',
        'isin_no',
        'open',
        'high',
        'low',
        'close',
        'prevclose',
      ];
    }
  }

  protected updateTableChips() {
    this.tableChips = [];
    const selectedOption = this.queryForm.get('selectedOption')?.value;

    if (selectedOption === 'A') {
      const keyDate = this.queryForm.get('fromDate')?.value;
      const indexId = this.queryForm.get('niftyOption')?.value;
      const index = this.niftyOption.find(
        (option) => option.id === indexId
      )?.value;
      if (keyDate) {
        this.tableChips.push(`Key Date: ${this.formatDate(keyDate)}`);
      }
      if (index) {
        this.tableChips.push(`Index: ${index}`);
      }
    } else if (selectedOption === 'B') {
      const fromDate = this.queryForm.get('fromDate')?.value;
      const toDate = this.queryForm.get('toDate')?.value;
      const indexId = this.queryForm.get('niftyOption')?.value;
      const index = this.niftyOption.find(
        (option) => option.id === indexId
      )?.value;
      const company = this.queryForm.get('company')?.value;
      if (fromDate) {
        this.tableChips.push(`From Date: ${this.formatDate(fromDate)}`);
      }
      if (toDate) {
        this.tableChips.push(`To Date: ${this.formatDate(toDate)}`);
      }
      if (index) {
        this.tableChips.push(`Index: ${index}`);
      }
      if (company && company !== 'All') {
        this.tableChips.push(`Company: ${company}`);
      }
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  // This is used by AXIS
  protected getEQClosingPriceList() {
    this.updateTableChips();

    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'getEquityClosingPriceList',
        this.queryForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.showLastDate =
            this.queryForm.get('selectedOption')?.value === 'A';
          this.mtmHistRates.data = data['data']['data'];
          this.currentDate = data['data']['todate'] || undefined;
          this.mtmHistRates.data.forEach((item) => {
            if (typeof item.market_cap === 'string') {
              item.total_asset = parseFloat(item.market_cap.replace(/,/g, ''));
            }
          });
          this.mtmHistRates.paginator = this.paginator;
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  // This is used by all for dropdown
  private getAllMappedCompanies(): void {
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getMtmCompanies', {
        niftyOption: this.queryForm.get('niftyOption')?.value,
      })
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.dropDownCompanies = [
            { symbol: 'All', option: 'All' },
            ...data['data'],
          ];
        },
      });
  }

  // This is for SUSER
  protected getMtmHistRates() {
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getMtmHist', this.queryForm.value)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.showLastDate =
            this.queryForm.get('selectedOption')?.value === 'A';
          this.mtmHistRates.data = data['data']['data'];
          this.currentDate = data['data']['todate'] || 'No Date Available';
          this.mtmHistRates.data.forEach((item) => {
            if (typeof item.market_cap === 'string') {
              item.total_asset = parseFloat(item.market_cap.replace(/,/g, ''));
            }
          });
          this.mtmHistRates.paginator = this.paginator;
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  protected sortMarketcap(sortType: 'asc' | 'desc'): void {
    console.log(sortType);

    if (this.mtmHistRates.data) {
      this.mtmHistRates.data = this.mtmHistRates.data.map((item) => ({
        ...item,
        market_cap:
          typeof item.market_cap === 'string'
            ? parseFloat(item.market_cap.replace(/,/g, ''))
            : item.market_cap,
      }));

      this.mtmHistRates.data = this.mtmHistRates.data.sort((a, b) => {
        const valueA = a.market_cap;
        const valueB = b.market_cap;
        return sortType === 'asc' ? valueA - valueB : valueB - valueA;
      });
    } else {
      console.log('Data not sorted - mtmHistRates is null or undefined.');
    }
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      symbol: 'Company',
      isin_no: 'ISIN',
      open: 'Open',
      high: 'High',
      low: 'Low',
      close: 'Close',
      prevclose: 'Previous Close',
      market_cap: 'Market Capital',
      // Add more mappings as needed
    };

    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {};
      for (const key in row) {
        if (key === 'market_cap') {
          newRow[headerMapping[key]] = (Number(row[key]) / 10000000).toFixed(2);
        } else if (headerMapping.hasOwnProperty(key) && key !== 'market_cap') {
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

  protected isSingleDateSelected(): boolean {
    return this.queryForm.get('selectedOption')?.value === 'A';
  }

  protected isDateRangeSelected(): boolean {
    return this.queryForm.get('selectedOption')?.value === 'B';
  }

  protected clearForm(): void {
    this.queryForm.reset();
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.queryForm.patchValue({
      selectedOption: 'A',
      sDate: formattedDate,
      fromDate: formattedDate,
      toDate: formattedDate,
    });
    this.updateTableChips();
  }

  // protected openModal() {
  //   this.dialog.open(InfoModalComponent, {
  //     panelClass: 'custom-mat-dialog',
  //     data: {
  //       title: 'Equity Closing Prices',
  //       content:
  //         'NSE provides Bhav copy files on every working day after market close.',
  //     },
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.mtmHistRates.filter = filterValue.trim().toLowerCase();
  }
}
