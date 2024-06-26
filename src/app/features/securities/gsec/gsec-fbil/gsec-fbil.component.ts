import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  selector: 'app-gsec-fbil',
  templateUrl: './gsec-fbil.component.html',
  styleUrls: ['./gsec-fbil.component.scss'],
})
export class GsecFbilComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected pageInfo = {
    title: 'GSEC',
    content:
      'FBIL publishes on a daily basis, on all Mumbai business days, the prices/YTM for Government of India Securities(G-sec) with effect from March 31, 2018. The rates are announced around 7 PM. The valuation rates for G-sec based on the extant methodology are computed sourcing transaction level data from NDS-OM electronic platform and using the cubic spline model. FBIL calculates G-Sec in-house.',
  };
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected gsecRateList!: MatTableDataSource<any>;
  protected gsecFormData: any = [];
  protected gsecRateForm!: FormGroup;
  protected currentDate?: string;
  protected displayedColumns!: Array<string>;
  protected tableChips: string[] = [];

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.pageSetup();
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.gsecRateForm = this.formBuilder.group({
      fromdate: [formattedDate, Validators.required],
      todate: [formattedDate],
      selectedOption: ['A', Validators.required],
    });
    this.getGsecList();
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
  }

  ngAfterViewInit() {
    this.gsecRateList.paginator = this.paginator;
  }

  protected getFormControllers(name: string) {
    const ctrl = this.gsecRateForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private pageSetup() {
    this.gsecRateList = new MatTableDataSource<any>();
    this.displayedColumns = [
      'date',
      'isin_no',
      'coupon',
      'maturity_date',
      'price',
      'ytm',
    ];
  }

  protected getGsecRates() {
    this.tableChips = [];
    const fromDate = this.datePipe.transform(
      this.gsecRateForm.value.fromdate,
      'dd.MM.yyyy'
    );
    const toDate = this.datePipe.transform(
      this.gsecRateForm.value.todate,
      'dd.MM.yyyy'
    );

    if (this.gsecRateForm.value.selectedOption === 'A') {
      this.tableChips.push(`Key Date: ${fromDate}`);
    } else if (this.gsecRateForm.value.selectedOption === 'B') {
      this.tableChips.push(`From Date: ${fromDate}`);
      this.tableChips.push(`To Date: ${toDate}`);
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getFbilGsecRates',
        this.gsecRateForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.gsecRateList.data = data['data']['data'];
          this.gsecRateList.paginator = this.paginator;
          this.currentDate = data['data']['todate'] || undefined;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getGsecList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getFbilGsecRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.gsecRateList.data = data['data']['data'];
          this.gsecRateList.paginator = this.paginator;
          this.currentDate = data['data']['todate'] || undefined;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv() {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      isin_no: 'ISIN',
      coupon: 'Coupon',
      maturity_date: 'Maturity Date',
      price: 'Price',
      ytm: 'YTM',
    };

    const customizedRatelist = this.gsecRateList.data.map(
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

    this.exportService.downloadFile(customizedRatelist, 'GSEC_RATES');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.gsecRateList.filter = filterValue.trim().toLowerCase();
  }
}
