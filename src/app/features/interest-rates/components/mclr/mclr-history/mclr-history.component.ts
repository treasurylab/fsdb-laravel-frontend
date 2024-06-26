import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mclr-history',
  templateUrl: './mclr-history.component.html',
  styleUrls: ['./mclr-history.component.scss'],
})
export class MclrHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected showTable = false;
  protected allData: any;
  protected msg: any = '';
  protected mclrBankList: any;

  protected rateHistoryList: any = [];
  protected tableChips: string[] = [];
  dataSource = new MatTableDataSource<any>();

  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;

  protected mclrHistoryForm = new FormGroup({
    from_date: new FormControl(''),
    to_date: new FormControl(''),
    bank_code: new FormControl('BKID'),
  });

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe
  ) {}

  displayedColumns: string[] = [
    // 'srno',
    'effective_date',
    'on',
    'onem',
    'threem',
    'sixm',
    'oney',
    'twoy',
    'threey',
    'fivey',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllBankList();

    this.showTable = false;
    const currentDate = new Date();
    const pastDate = new Date(currentDate);

    // From Date
    pastDate.setMonth(currentDate.getMonth() - 3);
    const fdformattedDate = pastDate.toISOString().split('T')[0];
    this.mclrHistoryForm!.get('from_date')!.setValue(fdformattedDate);

    // To Date
    const tdformattedDate = currentDate.toISOString().split('T')[0];
    this.mclrHistoryForm!.get('to_date')!.setValue(tdformattedDate);

    this.searchMCLRHistory();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.mclrHistoryForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected searchMCLRHistory() {
    // this.tableChips = [];

    // for (const key in this.mclrHistoryForm.value) {
    //   this.tableChips.push(` ${this.mclrHistoryForm.value}`);
    // }
    this.tableChips = [];

    const labelMapping: { [key: string]: string } = {
      from_date: 'From Date',
      to_date: 'To Date',
      bank_code: 'Bank',
    };
    // Extract form values and push to tableChips
    for (const key in this.mclrHistoryForm.controls) {
      const control = this.mclrHistoryForm.get(key);
      if (control && control.value) {
        const label = labelMapping[key] || key;
        let value = control.value;
        if (key === 'from_date' || key === 'to_date') {
          value = this.datePipe.transform(value, 'dd.MM.yyyy');
        }
        this.tableChips.push(`${label}: ${value}`);
      }
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.mclr,
        'getMclrRateHistory',
        this.mclrHistoryForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.allData = data['data'];
          if (typeof data['data'] === 'undefined') {
            this.msg = data['message'];
          } else {
            this.showTable = false;
            this.rateHistoryList = [];
            data['data'].forEach((value: any) => {
              this.rateHistoryList.push({
                effective_date: value.effective_date,
                on: value.ON,
                onem: value['1M'],
                threem: value['3M'],
                sixm: value['6M'],
                oney: value['1Y'],
                twoy: value['2Y'],
                threey: value['3Y'],
                fivey: value['5Y'],
              });
            });
            this.dataSource.data = this.rateHistoryList;
          }
        },
        error: (err: any) => {
          this.msg = err.error.message;
          this.rateHistoryList = [{ error: this.msg }];
          this.dataSource.data = this.rateHistoryList;
        },
      });
  }

  private getAllBankList() {
    this.apiService
      .getRequestLegacy(FeatureList.mclr, 'getAllMclrBankList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.mclrBankList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      bank_code: 'Bank Code',
      bank_name: 'Bank Name',
      frequency_type: 'Tenor',
      mclr_rate: 'Rate',
      effective_date: 'Effective Date',
      onem: '1 Month',
      threem: '3 Months',
      sixm: '6 Months',
      oney: '1 Year',
      twoy: '2 Years',
      threey: '3 Years',
      fivey: '5 Years',
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (
          key === 'url_mclr_update' ||
          key === 'url' ||
          key === 'file_name' ||
          key === 'repo'
        ) {
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
