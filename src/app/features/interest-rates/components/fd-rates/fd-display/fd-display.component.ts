import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { DatePipe } from '@angular/common';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
interface CustomFormGroup {
  bank_code: FormControl<string | null>;
  record_date: FormControl<string | null>;
  rate_catg: FormControl<string | null>;
  rate_type: FormControl<string | null>;
  tenor: FormControl<string | null>;
  start_date?: FormControl<string | null>;
  end_date?: FormControl<string | null>;
  int_type: FormControl<string | null>;
}

@Component({
  selector: 'app-fd-display',
  templateUrl: './fd-display.component.html',
  styleUrl: './fd-display.component.scss',
})
export class FdDisplayComponent implements OnInit {
  protected dateFlag: number = 0;
  bank_code: string = '';
  tenor: string = '';
  rateCatg: string = '';
  date: string = '';
  start_date: string = '';
  end_date: string = '';
  rateType: string = '';

  constructor(
    private apiService: ApiService, // private datePipe: DatePipe, // private exportService: ExportService
    private cdr: ChangeDetectorRef,
    private exportService: ExportService,
    protected dialog: MatDialog,
    protected datePipe: DatePipe
  ) {
    this.currentDate = new Date();
  }

  protected fdRatesData = [];
  protected selectedOption = 'Key Date';
  protected tableChips: string[] = [];

  protected fdRatesTable: MatTableDataSource<{
    tenor_desc: string;
    gc_interest_rate?: number;
    annualised_yield?: number;
    callable?: number;
    non_callable?: number;
    'r_<2'?: number;
    'r_2to<=3'?: number;
    'r_3to<=4'?: number;
    'r_4to<=5'?: number;
    'r_5to<=6'?: number;
    'r_6to<=7'?: number;
    'r_7to<=8'?: number;
    'r_8to<=9'?: number;
    'r_9to<=10'?: number;
    'r_2to<=10'?: number;
    'r_5to<5.10'?: number;
    'r_5.10to<24.90'?: number;
    'r_24.90to<25.00'?: number;
    'r_25.00to<100.00'?: number;
    'r_100.00to<250.00'?: number;
    'r_250.00to<500.00'?: number;
    'r_>=500'?: number;
    'r_100to<=500'?: number;
    'r_>1000'?: number;
    'r_25to<=50'?: number;
    'r_10to<=25'?: number;
    rate_catg: Array<any>;
    bank_code: string;
    record_date: Date;
  }> = new MatTableDataSource();

  // protected fdRatesForm!: FormGroup & CustomFormGroup;
  protected currentDate: Date;
  protected bankList = [
    { bank_code: 'BARB', bank_name: 'Bank of Baroda' },
    { bank_code: 'CNRB', bank_name: 'Canara Bank' },
    { bank_code: 'ICICI', bank_name: 'ICICI Bank' },
    { bank_code: 'IDIB', bank_name: 'Indian Bank' },
    { bank_code: 'PUNB', bank_name: 'Punjab National Bank' },
    { bank_code: 'SBIN', bank_name: 'State Bank of India' },
  ];

  protected rateTypes: { rate_type: string }[] = [];

  displayedColumns: string[] = [
    'srno',
    'bank_code',
    'record_date',
    'from_amt',
    'to_amt',

    'gc_interest_rate',
  ];

  protected tenorList: {
    std_tenor_desc: string;
  }[] = [];

  protected rateCatList: {
    rate_catg: string;
    from_amt: string | number;
    to_amt: string | number;
  }[] = [];

  protected intTypeList: [] = [];

  protected intTypesObject = {
    gc_interest_rate: ['General Category', 100],
    annualised_yield: ['Annualised Yield', 101],
    callable: ['Callable', 102],
    non_callable: ['Non-Callable', 103],
    'r_<2': ['Less than 2 Cr.', 1],
    'r_2to<=3': ['From 2 Cr. to 3 Cr.', 2],
    'r_2to<5': ['From 2 Cr. to 5 Cr.', 3],
    'r_3to<=4': ['From 3 Cr. to 4 Cr.', 4],
    'r_4to<=5': ['From 4 Cr. to 5 Cr.', 5],
    'r_5to<=6': ['From 5 Cr. to 6 Cr.', 8],
    'r_6to<=7': ['From 6 Cr. to 7 Cr.', 9],
    'r_7to<=8': ['From 7 Cr. to 8 Cr.', 10],
    'r_8to<=9': ['From 8 Cr. to 9 Cr.', 11],
    'r_9to<=10': ['From 9 Cr. to 10 Cr.', 12],
    'r_2to<=10': ['From 2 Cr. to 10 Cr.', 3],
    'r_5to<5.10': ['From 5 Cr. to 5.1 Cr.', 7],
    'r_5.10to<24.90': ['From 5.1 Cr. to 24.9 Cr.', 13],
    'r_5to<=25': ['From 5 Cr. to 25 Cr.', 14],
    'r_10to<=25': ['From 10 Cr. to 25 Cr.', 15],
    'r_25to<=50': ['From 25 Cr. to 50 Cr.', 17],
    'r_24.90to<25.00': ['From 24.9 Cr. to 25 Cr.', 16],
    'r_25to<=100': ['From 25 Cr. to 100 Cr.', 18],
    'r_25.00to<100.00': ['From 25 Cr. to 100 Cr.', 19],
    'r_100to<=250': ['From 100 Cr. to 250 Cr.', 22],
    'r_100.00to<250.00': ['From 100 Cr. to 250 Cr.', 21],
    'r_250.00to<500.00': ['From 250 Cr. to 500 Cr.', 24],
    'r_>=500': ['Above 500 Cr.', 26],
    'r_100to<=500': ['From 100 Cr. to 500 Cr.', 23],
    'r_500to<=1000': ['From 500 Cr. to 1000 Cr.', 26],
    'r_>1000': ['From 1000 Cr.', 27],
    'r_50to<=100': ['From 50 Cr. to 100 Cr.', 20],
    'r_<500': ['Less than 500Cr.', 25],
    'r_250to<=500': ['From 250 Cr. to 500 Cr.', 24],
  };

  protected fdRatesForm = new FormGroup({
    bank_code: new FormControl('', Validators.required),
    record_date: new FormControl('', Validators.required),
    rate_catg: new FormControl('', Validators.required),
    rate_type: new FormControl('', Validators.required),
    tenor: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    int_type: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    // this.getJSONtree();
    // console.log(this.selectedOption);
    this.fdRatesForm.get('bank_code')?.valueChanges.subscribe(() => {
      // Reset other form controls to null
      this.fdRatesForm.patchValue({
        record_date: null,
        rate_catg: null,
        rate_type: null,
        tenor: null,
        start_date: null,
        end_date: null,
        int_type: null,
      });
      this.fdRatesTable.data = [];
      this.currentDate = new Date(NaN);
    });

    this.fdRatesForm.get('tenor')?.valueChanges.subscribe(() => {
      // Reset other form controls to null
      this.fdRatesForm.patchValue({
        record_date: null,
        rate_catg: null,
        rate_type: null,
        start_date: null,
        end_date: null,
        int_type: null,
      });
    });
  }

  protected onSelectionChange(event: MatRadioChange) {
    this.selectedOption = event.value;
    console.log(this.selectedOption);
  }

  // protected onRateCatgChange_(option: string) {
  //   this.rateCatg = this.fdRatesForm.get('rate_catg')?.value as string;
  //   console.log(this.date);
  //   switch (option) {
  //     case 'Key Date':
  //       this.getRateTypeList(
  //         this.bank_code,
  //         this.tenor,
  //         this.rateCatg,
  //         this.date
  //       );
  //       break;
  //     default:
  //       this.getRateTypeListRange(
  //         this.bank_code,
  //         this.tenor,
  //         this.rateCatg,
  //         this.start_date,
  //         this.end_date
  //       );
  //   }
  // }

  protected onRateCatgChange(_event: MatSelectChange, option: string) {
    this.rateCatg = this.fdRatesForm.get('rate_catg')?.value as string;
    console.log(this.date);
    switch (option) {
      case 'Key Date':
        this.getRateTypeList(
          this.bank_code,
          this.tenor,
          this.rateCatg,
          this.date
        );
        break;
      default:
        this.getRateTypeListRange(
          this.bank_code,
          this.tenor,
          this.rateCatg,
          this.start_date,
          this.end_date
        );
    }
  }
  getRateTypeListRange(
    bank_code: string,
    tenor: string,
    rateCatg: string,
    start_date: string,
    end_date: string
  ) {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getRateTypeRange', [
        bank_code,
        tenor,
        rateCatg,
        start_date,
        end_date,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.rateTypes = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  getRateTypeList(
    bank_code: string,
    tenor: string,
    rateCatg: string,
    date: string
  ) {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getRateType', [
        bank_code,
        tenor,
        rateCatg,
        date,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.rateTypes = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected tenor_list = [
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

  //function that calls getTenorList function

  protected onRateTypeChange(_event: MatSelectChange) {
    this.intTypeList = [];

    switch (this.selectedOption) {
      case 'Key Date':
        this.getInterestTypeList();
        break;
      default:
        this.getIntTypeListRange();
    }
  }

  protected tabList = ['Key Date', 'Date Range'];

  protected onTabChange(event: string) {
    this.selectedOption = event;
    console.log(this.selectedOption);
  }

  protected startDateControl = this.fdRatesForm.get(
    'start_date'
  ) as FormControl;

  protected dummyDateChange(event: any, option: string) {
    console.log(event.timeStamp);
  }
  protected onDateSelectionChange(option: string) {
    this.bank_code = this.fdRatesForm.get('bank_code')?.value as string;
    this.tenor = this.fdRatesForm.get('tenor')?.value as string;

    switch (option) {
      case 'Key Date':
        this.date = this.fdRatesForm.get('record_date')?.value as string;
        console.log(this.fdRatesForm.get('record_date')?.value as string);
        this.getRateCatList(this.bank_code, this.tenor, this.date);
        break;
      default:
        this.start_date = this.fdRatesForm.get('start_date')?.value as string;
        this.end_date = this.fdRatesForm.get('end_date')?.value as string;
        this.getRateCatListRange(
          this.bank_code,
          this.tenor,

          this.start_date,
          this.end_date
        );
    }
  }
  protected resetScreen() {}
  protected getJSONtree() {
    this.apiService
      .postRequestLegacy(
        FeatureList.fdrates,
        'generateFdRatesDisplayJSONtree',
        []
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected getIntTypeListRange() {
    this.rateType = this.fdRatesForm.value.rate_type as string;
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getAmountRangeDateRange', [
        this.bank_code,
        this.rateCatg,
        this.tenor,
        this.rateType,
        this.start_date,
        this.end_date,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.intTypeList = data['data'];
          this.intTypeList.sort((a, b) => {
            return this.intTypesObject[a][1] - this.intTypesObject[b][1];
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected getInterestTypeList() {
    this.rateType = this.fdRatesForm.value.rate_type as string;

    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getAmountRange', [
        this.bank_code,
        this.rateCatg,
        this.tenor,
        this.rateType,
        this.date,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.intTypeList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getRateCatListRange(
    bank: string,
    tenor: string,

    startDate: string,
    endDate: string
  ) {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getRateCatListRange', [
        bank,
        tenor,

        startDate,
        endDate,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.rateCatList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  //returns bank code and tenor specific unique rate catg in fdrate from backend
  protected getRateCatList(bank: string, tenor: string, date: string) {
    // console.log('called');
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getRateCatList', [
        bank,
        tenor,
        date,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.rateCatList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected headerMapping: { [key: string]: string } = {
    bank_code: 'Bank Code',
    gc_interest_rate: 'Interest Rate',
    rate_catg: 'Rate Category',
    record_date: 'Recorded Date',
    from_amt: 'From Amount',
    to_amt: 'To Amount',
  };

  protected exportToCsv(dataSource: any, filename: string) {
    const customizedRatelist = dataSource;

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }
  protected getFormControllers(name: string) {
    const ctrl = this.fdRatesForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  //function to get table data
  protected searchFdRatesData() {
    if (this.selectedOption == 'Key Date') {
      this.dateFlag = 1;
      const bank_code = this.fdRatesForm.value.bank_code as string;
      const rate_catg = this.fdRatesForm.value.rate_catg as string;
      const record_date = this.fdRatesForm.value.record_date as string;
      const tenor = this.fdRatesForm.value.tenor as string;
      const rate_type = this.fdRatesForm.value.rate_type as string;
      const int_type = this.fdRatesForm.value.int_type as string;

      {
        this.tableChips = [];
        this.tableChips.push(`Bank: ${bank_code} `);
        this.tableChips.push(`Tenor: ${tenor} `);
        this.tableChips.push(
          `Date: ${this.datePipe.transform(
            this.fdRatesForm.value.record_date,
            'dd.MM.yyyy'
          )} `
        );

        this.tableChips.push(`Category: ${rate_catg} `);
        this.tableChips.push(`Type: ${rate_type} `);
        this.tableChips.push(`Amount: ${int_type} `);
      }

      this.apiService
        .postRequestLegacy(FeatureList.fdrates, 'getFdRatesDataKeyDate', [
          bank_code,
          rate_catg,
          record_date,
          tenor,
          rate_type,
          int_type,
        ])
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            this.currentDate = data['data'][0]['record_date'];
            this.fdRatesTable.data = data['data'];
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    } else {
      const bank_code = this.fdRatesForm.value.bank_code as string;
      const rate_catg = this.fdRatesForm.value.rate_catg as string;
      const start_date = this.fdRatesForm.value.start_date as string;
      const end_date = this.fdRatesForm.value.end_date as string;
      const tenor = this.fdRatesForm.value.tenor as string;
      const rate_type = this.fdRatesForm.value.rate_type as string;
      const int_type = this.fdRatesForm.value.int_type as string;
      this.apiService
        .postRequestLegacy(FeatureList.fdrates, 'getFdRatesDataDateRange', [
          bank_code,
          rate_catg,
          start_date,
          tenor,
          rate_type,
          end_date,
          int_type,
        ])
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.fdRatesTable.data = data['data'];
            console.log(this.fdRatesTable);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }

    // console.log(this.fdRatesForm.value);
  }
  protected filterIcon = faFilter;
  protected clearIcon = faEraser;
  protected searchIcon = faMagnifyingGlass;
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;

  sortInterestRate(sortType: 'asc' | 'desc'): void {
    console.log(this.fdRatesTable.data);
    if (this.fdRatesTable) {
      this.fdRatesTable.data.forEach((item) => {
        if (typeof item.gc_interest_rate === 'string') {
          item.gc_interest_rate = parseFloat(item.gc_interest_rate);
        }
      });
      this.fdRatesTable.data = this.fdRatesTable.data.sort((a, b) => {
        const valueA = a.gc_interest_rate as number;
        const valueB = b.gc_interest_rate as number;
        return sortType === 'asc' ? valueA - valueB : valueB - valueA;
      });
      this.cdr.detectChanges();
    } else {
      console.log(
        'Data not sorted - fdRatesTable or data is null or undefined.'
      );
    }
  }

  protected openModal() {
    // const dialogRef = this.dialog.open(FdrateinfoComponent, {
    //   panelClass: 'custom-mat-dialog',
    // });
  }
  protected eraseData() {
    this.dateFlag = 0;
    this.fdRatesTable.data = [];
  }
}
