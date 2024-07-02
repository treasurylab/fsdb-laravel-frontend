import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import {
  faCloudArrowDown,
  faEraser,
  faFilter,
  faLink,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ulip-scheme',
  templateUrl: './ulip-scheme.component.html',
  styleUrls: ['./ulip-scheme.component.scss'],
})
export class UlipSchemeComponent implements OnInit {
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected filterIcon = faFilter;
  protected clearIcon = faEraser;
  protected linkIcon = faLink;
  protected tableChips: string[] = [];
  protected pageInfo = {
    title: 'ULIP Scheme',
    content:
      "Net Asset Values (NAV's) for different Unit Linked Funds are published at the End of the Day at the respective Fund Houses website. Data is aggregated from these websites and presented here.",
  };
  exportUlipRates: boolean = false;
  ulipRateList: any = [];
  formGroupdata: any = [];
  protected searchInput = new FormControl('');
  recordDate: string | null | undefined;

  protected uliprate = new FormGroup({
    sdate: new FormControl('', { nonNullable: true }),
  });

  displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];
  displayedColumnDW2 = [
    'no',
    'isin',
    'type',
    'fundhouse',
    'name',
    // 'date',
    'price',
  ];

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
    this.uliprate!.get('sdate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getUlipRatesList(true);
  }

  protected getFormControllers(name: string) {
    const ctrl = this.uliprate.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getUlipRatesList(initial: boolean = false) {
    let apiCall: Observable<unknown>;
    if (initial) {
      apiCall = this.apiService.postRequest('ulip-rates/rate-list');
    } else {
      apiCall = this.apiService.postRequest(
        'ulip-rates/rate-list',
        this.uliprate.value
      );
    }
    this.tableChips = [];
    const inputDate = this.uliprate.get('sdate')!.value;
    const transformedDate = this.datePipe.transform(inputDate, 'dd.MM.yyyy');
    this.tableChips.push(`Key Date: ${transformedDate}`);

    apiCall.pipe(first()).subscribe({
      next: (data: any) => {
        this.ulipRateList = data['data'];
        this.exportUlipRates = true;
        if (this.ulipRateList.length > 0) {
          this.recordDate = this.datePipe.transform(
            this.ulipRateList[0].record_date,
            'dd.MM.yyyy'
          );
        } else {
          this.recordDate = 'No Date Available';
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  protected filterUlipRateList() {
    const rawValue = this.searchInput.value;
    if (rawValue === null || rawValue === '') {
      return this.ulipRateList;
    }
    const searchValue = rawValue.toLowerCase();
    return this.ulipRateList.filter((item: any) => {
      const mtmRate = String(item.mtm_rate);

      return (
        item.isin_no.toLowerCase().includes(searchValue) ||
        item.prod_code.toLowerCase().includes(searchValue) ||
        item.bp_name.toLowerCase().includes(searchValue) ||
        item.scheme_name.toLowerCase().includes(searchValue) ||
        item.record_date.toLowerCase().includes(searchValue) ||
        mtmRate.toLowerCase().includes(searchValue)
      );
    });
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      isin_no: 'SFIN',
      prod_code: 'Type',
      bp_name: 'Fund House',
      scheme_name: 'Scheme Name',
      mtm_rate: 'Price',
      record_date: 'Maturity Date',
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

    // Convert the customized data to a CSV string
    // this.csvData = this.convertToCsv(customizedRatelist);

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
