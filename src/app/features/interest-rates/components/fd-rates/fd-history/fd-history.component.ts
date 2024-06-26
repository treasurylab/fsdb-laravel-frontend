import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FdComparisonComponent } from '../fd-comparison/fd-comparison.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ExportService } from 'src/app/core/services/export.service';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { FeatureList } from 'src/features';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-fd-history',
  templateUrl: './fd-history.component.html',
  styleUrl: './fd-history.component.scss',
})
export class FdHistoryComponent implements OnInit, AfterViewInit {
  // onPageChange($event: PageEvent) {
  //   const pageIndex = event.pageIndex;
  //   const pageSize = event!.pageSize;
  // }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onValueSelected() {
    console.log(this.fdRateHistoryForm.value.month);
  }
  constructor(
    private apiService: ApiService, // private datePipe: DatePipe, // private exportService: ExportService
    private cdr: ChangeDetectorRef,
    private exportService: ExportService,
    protected dialog: MatDialog
  ) {}

  // Default values
  defaultMonthId: number = 4; // Example: January
  defaultYear: number = 2024; // Example: 2024
  defaultBankCode: string = 'IDIB'; // Example: ABC

  ngAfterViewInit() {
    this.fdRateHistoryTable.paginator = this.paginator;
  }

  protected monthDic: { [key: string]: string } = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };
  protected monthIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  protected months: { id: number; name: string }[] = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];

  protected years: Array<number> = [];
  protected tableChips: string[] = [];

  protected populateYears() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 50;
    for (let year = 2020; year <= endYear; year++) {
      this.years.push(year);
    }
    // this.getFdRateBankDets();
  }

  protected fdRateHistoryTable: MatTableDataSource<{
    std_tenor_desc: string;
    max_value: number;
    from_amt: number;
    to_amt: number;
    bank_code: string;
    record_date: string;
  }> = new MatTableDataSource();

  exportToCsv(ratelist: any) {
    const filename: string =
      'FD Rate History' +
      '-' +
      this.fdRateHistoryForm.value.bank_code +
      '-' +
      this.monthDic[this.fdRateHistoryForm.value.month!] +
      '-' +
      this.fdRateHistoryForm.value.year;

    const headerMapping: { [key: string]: string } = {
      bank_code: 'Bank Code',
      std_tenor_desc: 'Tenor',
      from_amt: 'From Amt.',
      to_amt: 'To Amt.',
      max_value: 'Interest Rate (%)',
      record_dTate: 'Issue Date',
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (headerMapping.hasOwnProperty(key)) {
          newRow[headerMapping[key]] = row[key];
        }
      }
      return newRow;
    });
    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }

  ngOnInit(): void {
    this.getBankMap();

    this.populateYears();
    this.constructTableChips();

    this.searchFDRatesHistory();
  }

  protected bankMap: { [key: string]: string } = {};
  protected bankCodes: string[] = [];

  protected getBankMap() {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getBankMap')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.bankMap = data.data;
          this.bankCodes = Object.keys(this.bankMap);

          //
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.fdRateHistoryForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected filterIcon = faFilter;
  protected clearIcon = faEraser;
  protected searchIcon = faMagnifyingGlass;
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  //set up default values
  public fdRateHistoryForm = new FormGroup({
    bank_code: new FormControl(this.defaultBankCode, Validators.required),
    month: new FormControl(this.defaultMonthId, Validators.required),
    year: new FormControl(this.defaultYear, Validators.required),
  });
  protected bankList: { bank_code: string; bank_name: string }[] = [];

  protected constructTableChips() {
    this.tableChips = [];
    const formValue = this.fdRateHistoryForm.value as { [key: string]: any }; // Type assertion

    for (const key in formValue) {
      if (
        formValue[key] !== '' &&
        formValue[key] !== null &&
        formValue[key] !== undefined
      ) {
        let label = key;
        let value = formValue[key];

        if (key === 'month') {
          label = 'Month';
          value = this.monthDic[value];
        }
        if (key === 'year') {
          label = 'Year';
        }
        if (key === 'bank_code') {
          label = 'Bank';
        }

        this.tableChips.push(`${label}: ${value}`);
      }
    }
  }

  public searchFDRatesHistory() {
    this.fdRateHistoryTable.data = [];

    const bankCode = this.fdRateHistoryForm.value.bank_code;
    const month = this.fdRateHistoryForm.value.month;
    const year = this.fdRateHistoryForm.value.year;

    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRatesHistory', [
        bankCode,
        month,
        year,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.fdRateHistoryTable.data = data.data;
          // this.paginator.length = data.data.length; // Assuming API response contains total count
          // this.paginator.pageIndex = pageIndex;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected displayedColumns: string[] = [
    'bank_code',
    'record_date',
    'from_amt',
    'to_amt',
    'std_tenor_desc',
    'max_value',
  ];

  public resetScreen() {
    this.fdRateHistoryForm.reset();
    this.fdRateHistoryTable.data = [];
  }

  // public getFdRateBankDets() {
  //   this.apiService
  //     .postRequest(FeatureList.fdrates, 'getFdRateBankDets')
  //     .pipe(first())
  //     .subscribe({
  //       next: (data: any) => {
  //         data.data.forEach((ele: { bank_name: string; bank_code: string }) => {
  //           this.bankList.push(ele);
  //           this.bankList.sort((a, b) =>
  //             a.bank_code.localeCompare(b.bank_code)
  //           );

  //           // this.searchFDRatesHistory();
  //         });
  //       },
  //       error: (err: any) => {
  //         console.log(err);
  //       },
  //     });
  // }
}
