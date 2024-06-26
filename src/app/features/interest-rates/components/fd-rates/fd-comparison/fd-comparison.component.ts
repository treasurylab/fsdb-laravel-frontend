import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from 'src/app/core/services/export.service';
import { FeatureList } from 'src/features';
import { first } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { MatSelect } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-fd-comparison',
  templateUrl: './fd-comparison.component.html',
  styleUrl: './fd-comparison.component.scss',
})
export class FdComparisonComponent implements OnInit {
  protected isBankSelected() {
    if ((this.fdRatesForm.value.bank_code as string[]).length) {
      this.tenorDisabled = false;
    } else {
      this.tenorDisabled = true;
    }
  }
  constructor(
    private apiService: ApiService, // private datePipe: DatePipe, // private exportService: ExportService
    private cdr: ChangeDetectorRef,
    private exportService: ExportService,
    protected dialog: MatDialog,
    protected datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.getFdRateBankDets();

    this.updateTableChips();

    // this.getBankMap();

    this.searchFdRatesData();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.fdRatesTable.paginator = this.paginator;
  }

  protected bankList: { bank_name: string; bank_code: string }[] = [];
  protected tableChips: string[] = [];

  protected fdRatesForm = new FormGroup({
    bank_code: new FormControl(['BARB', 'CNRB', 'ICICI'], Validators.required),
    amt_range: new FormControl('2-5', Validators.required),
    tenor: new FormControl(
      ['7 days to 14 days', '15 days to 29 days', '30 days to 45 days'],
      Validators.required
    ),
    start_date: new FormControl('2024-01-01', Validators.required),
    end_date: new FormControl('2024-06-06', Validators.required),
  });

  public resetScreen() {
    this.fdRatesForm.reset();
    this.fdRatesTable.data = [];
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

          console.log(this.bankMap);
          console.log(this.bankCodes);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  public getFdRateBankDets() {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRateBankDets')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          data.data.forEach((ele: { bank_name: string; bank_code: string }) => {
            this.bankList.push(ele);
            this.bankList.sort((a, b) =>
              a.bank_code.localeCompare(b.bank_code)
            );
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected updateTableChips() {
    const bankCodes = this.fdRatesForm.value.bank_code as string[];
    const tenors = this.fdRatesForm.value.tenor as string[];
    const prinicipleAmt = this.fdRatesForm.value.amt_range as string;

    {
      this.tableChips = [];
      this.tableChips.push(`Bank: ${bankCodes} `);
      this.tableChips.push(`Tenor: ${tenors} `);
      this.tableChips.push(
        `Start Date: ${this.datePipe.transform(
          this.fdRatesForm.value.start_date,
          'dd.MM.yyyy'
        )} `
      );
      this.tableChips.push(
        `End Date: ${this.datePipe.transform(
          this.fdRatesForm.value.end_date,
          'dd.MM.yyyy'
        )} `
      );
      this.tableChips.push(`Amount Range: ${prinicipleAmt} `);
    }
  }

  protected searchFdRatesData() {
    const bankCodes = this.fdRatesForm.value.bank_code as string[];
    const tenors = this.fdRatesForm.value.tenor as string[];
    const startDate = this.fdRatesForm.value.start_date as string;
    const endDate = this.fdRatesForm.value.end_date as string;
    const prinicipleAmt = this.fdRatesForm.value.amt_range as string;
    // console.log(prinicipleAmt, bankCodes, tenors, startDate, endDate);

    {
      this.tableChips = [];
      this.tableChips.push(`Bank: ${bankCodes} `);
      this.tableChips.push(`Tenor: ${tenors} `);
      this.tableChips.push(
        `Start Date: ${this.datePipe.transform(
          this.fdRatesForm.value.start_date,
          'dd.MM.yyyy'
        )} `
      );
      this.tableChips.push(
        `End Date: ${this.datePipe.transform(
          this.fdRatesForm.value.end_date,
          'dd.MM.yyyy'
        )} `
      );
      this.tableChips.push(`Amount Range: ${prinicipleAmt} `);
    }

    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRatesComparison', [
        prinicipleAmt,
        bankCodes,
        tenors,
        startDate,
        endDate,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.fdRatesTable.data = data.data;
          // console.log(this.fdRatesTable.data);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(dataSource: any) {
    const filename = 'FD Rate Comparison';
    const headerMapping: { [key: string]: string } = {
      bank_code: 'Bank Code',
      std_tenor_desc: 'Tenor',
      from_amt: 'From Amt.',
      to_amt: 'To Amt.',
      max_value: 'Interest Rate (%)',
      record_date: 'Record Date',
    };
    const customizedRatelist = dataSource.map((row: { [key: string]: any }) => {
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

  protected fdRatesTable: MatTableDataSource<{
    std_tenor_desc: string;
    max_value: number;
    amt_range: number;
    to_amt: number;
    bank_code: string;
    record_date: Date;
  }> = new MatTableDataSource();

  protected tenorList = [
    '7 days to 14 days',
    '15 days to 29 days',
    '30 days to 45 days',
    '46 days to 60 days',
    '61 days to 90 days',
    '91 days to 120 days',
    '121 days to 150 days',
    '151 days to 184 days',
    '185 days to 210 days',
    '211 days to 240 days',
    '241 days to 270 days',
    '271 days to 300 days',
    '301 days to 330 days',
    '331 days to < 1 year',
    '1 year to 389 days',
    '390 days to < 15 months',
    '15 months to < 18 months',
    '18 months to 2 years',
    '2 years 1 day to 3 years',
    '3 years 1 day to 5 years',
    '5 years 1 day to 7 years',
    '7 years 1 day to 10 years',
  ];

  protected filterIcon = faFilter;
  protected clearIcon = faEraser;
  protected searchIcon = faMagnifyingGlass;
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;

  protected getFormControllers(name: string) {
    const ctrl = this.fdRatesForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected displayedColumns = [
    'bank_code',
    'std_tenor_desc',
    'record_date',
    'from_amt',
    'to_amt',
    'max_value',
  ];

  protected amtranges: { amt_desc: string; amt_code: string }[] = [
    { amt_desc: 'Below 2 Crores', amt_code: '0-2' },
    { amt_desc: 'From 2 Crores to 5 Crores', amt_code: '2-5' },
    { amt_desc: 'From 5 Crores to 10 Crores', amt_code: '5-10' },
    { amt_desc: 'Above 10 Crores', amt_code: '10-Above' },
  ];

  protected amtRangeList: { from_amt: string; to_amt: string }[] = [];

  protected sortInterestRate(text: string) {
    console.log(text);
  }
  // protected openModal() {
  //   // const dialogRef = this.dialog.open(FdrateinfoComponent, {
  //   //   panelClass: 'custom-mat-dialog',
  //   // });
  // }

  protected eraseData() {
    this.fdRatesTable.data = [];
  }

  protected tenorError: boolean = false;
  protected tenorDisabled: boolean = true;
  protected isTenorDisabled() {
    if (this.tenorDisabled) {
      this.tenorError = true;
    } else {
      this.tenorError = false;
    }
  }
}
