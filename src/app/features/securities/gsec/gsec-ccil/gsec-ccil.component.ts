import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  faCloudArrowDown,
  faEraser,
  faFilter,
  faLink,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-ccil-prices',
  templateUrl: './gsec-ccil.component.html',
  styleUrls: ['./gsec-ccil.component.scss'],
})
export class GsecCcilComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected dataSource = new MatTableDataSource<any>();

  protected pageInfo = {
    title: 'GSEC',
    content:
      'GSEC prices for Mark to Market (MTM) are sourced from CCIL. Mark to Market (MTM) prices of Securities are calculated by CCIL at the end of each trading day. These are expressed in terms of Clean Prices (i.e. accrued interest is not taken into account for arriving at such prices)',
  };
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;
  protected linkIcon = faLink;
  protected gsecPriceForm = new FormGroup({
    sdate: new FormControl('', [Validators.required]),
  });
  protected exportGsecPrices: boolean = false;
  protected formGroupdata: any = [];
  protected searchInput: any;
  protected datediff: any;
  protected tableChips: string[] = [];
  protected currentDate: string = 'No Date Available';

  protected displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];
  protected displayedColumnDW2 = [
    // 'srno',
    'isin',
    'type',
    'name',
    'date',
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
    this.gsecPriceForm!.get('sdate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getGsecPricesOn();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.gsecPriceForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  getGsecPricesOn() {
    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'getGsecPricesOn',
        this.formGroupdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dataSource.data = data['data'];
          this.dataSource.paginator = this.paginator;
          this.currentDate = this.dataSource.data[0].vdt || 'No Date Available';
          this.exportGsecPrices = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getGsecrates() {
    this.formGroupdata = this.gsecPriceForm.value;
    if (
      !isNaN(Date.parse(this.formGroupdata.sdate)) ||
      !isNaN(Date.parse(this.formGroupdata.fromdate))
    ) {
      this.formGroupdata.sdate = new Date(this.formGroupdata.sdate);
      this.formGroupdata.sdate = this.datePipe.transform(
        this.formGroupdata.sdate,
        'yyyy-MM-dd'
      );
    }
    this.tableChips = [];

    this.tableChips.push(
      `Key Date: ${this.datePipe.transform(
        this.formGroupdata.sdate,
        'dd.MM.yyyy'
      )} `
    );
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getgsecrates', this.formGroupdata)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dataSource.data = data['data'];
          this.dataSource.paginator = this.paginator;
          this.currentDate = this.dataSource.data[0].vdt || 'No Date Available';
          this.exportGsecPrices = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  clearForm() {
    this.gsecPriceForm.reset();
  }

  exportToCsv() {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      isin_no: 'ISIN',
      mtm_rate: 'Price',
      record_date: 'Maturity Date',
      sec_type: 'Type',
      sec_name: 'Name',
      vdt: 'Date',
      // Add more mappings as needed
    };

    // Create a new array with customized headers
    const customizedRatelist = this.dataSource.data.map(
      (row: { [key: string]: any }) => {
        const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
        for (const key in row) {
          if (headerMapping.hasOwnProperty(key)) {
            newRow[headerMapping[key]] = row[key];
          } else {
            newRow[key] = row[key];
          }
        }
        return newRow;
      }
    );

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, 'GSEC_PRICES');
  }

  protected openModal() {
    this.dialog.open(InfoModalComponent, {
      panelClass: 'custom-mat-dialog',
      data: {
        title: 'Government Securities Prices',
        content:
          'G-Sec prices for Mark to Market (MTM) are sourced from CCIL. Mark to Market (MTM) prices of Securities are calculated by CCIL at the end of each trading day. These are expressed in terms of Clean Prices (i.e. accrued interest is not taken into account for arriving at such prices)',
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
