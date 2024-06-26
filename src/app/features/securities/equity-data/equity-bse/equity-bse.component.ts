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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-equity-bse',
  templateUrl: './equity-bse.component.html',
  styleUrls: ['./equity-bse.component.scss'],
})
export class EquityBse implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected bseInfo = {
    title: 'Equity Closing Prices (BSE)',
    content:
      'BSE provides Bhav copy files on every working day after market close.',
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
  protected sensexOption = [
    { id: 'sensex50', value: 'Sensex 50' },
    { id: 'sensex200', value: 'Sensex 200' },
  ];
  protected searchKey: string = '';
  protected currentDate?: string;
  protected queryForm!: FormGroup;
  protected showLastDate = true;

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected datePipe: DatePipe
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
      sensexOption: [this.cgrpId === '28' ? 'eqList' : 'sensex50'],
      company: ['All'],
    });
    this.queryForm.valueChanges.subscribe(() => {
      this.updateTableChips();
    });
    this.getAllMappedCompanies();
    if (this.cgrpId !== '28') {
      this.getMtmHistRates();
      this.queryForm.get('sensexOption')?.valueChanges.subscribe((_) => {
        this.getAllMappedCompanies();
      });
    } else {
      this.getBseClosingPriceList();
    }
    this.updateTableChips();
  }

  ngAfterViewInit() {
    this.mtmHistRates.paginator = this.paginator;
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
      const indexId = this.queryForm.get('sensexOption')?.value;
      const indexValue = this.sensexOption.find(
        (option) => option.id === indexId
      )?.value;
      if (keyDate) {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(keyDate, 'dd.MM.yyyy')}`
        );
      }
      if (indexValue) {
        this.tableChips.push(`Index: ${indexValue}`);
      }
    } else if (selectedOption === 'B') {
      const fromDate = this.queryForm.get('fromDate')?.value;
      const toDate = this.queryForm.get('toDate')?.value;
      const indexId = this.queryForm.get('sensexOption')?.value;
      const indexValue = this.sensexOption.find(
        (option) => option.id === indexId
      )?.value;
      const company = this.queryForm.get('company')?.value;
      if (fromDate) {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(fromDate, 'dd.MM.yyyy')}`
        );
      }
      if (toDate) {
        this.tableChips.push(
          `To Date: ${this.datePipe.transform(toDate, 'dd.MM.yyyy')}`
        );
      }
      if (indexValue) {
        this.tableChips.push(`Index: ${indexValue}`);
      }
      if (company && company !== 'All') {
        this.tableChips.push(`Company: ${company}`);
      }
    }
  }

  // This is used by AXIS
  protected getBseClosingPriceList() {
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
      .postRequestLegacy(FeatureList.equity, 'getBseMtmCompanies', {
        sensexOption: this.queryForm.get('sensexOption')?.value,
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
    this.updateTableChips();
    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'getBseEquityRates',
        this.queryForm.value
      )
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
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      company_name: 'Company Name',
      isin_no: 'ISIN',
      open: 'Open',
      high: 'High',
      low: 'Low',
      close: 'Close',
      prevclose: 'Previous Close',
    };

    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.mtmHistRates.filter = filterValue.trim().toLowerCase();
  }
}
