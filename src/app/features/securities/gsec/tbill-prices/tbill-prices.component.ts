import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  selector: 'app-tbill-prices',
  templateUrl: './tbill-prices.component.html',
  styleUrls: ['./tbill-prices.component.scss'],
})
export class TbillPricesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected tbillPriceRateList: any = [];
  protected formGroupdata: any = [];
  protected tableChips: string[] = [];
  protected searchInput: any;
  protected currentDate: string = 'No Date Available';

  protected pageInfo = {
    title: 'T-Bill Prices(India)',
    content:
      'T-Bill prices for Mark to Market (MTM) are sourced from CCIL. Mark to Market (MTM) prices of Securities are calculated by CCIL at the end of each trading day. These are expressed in terms of Clean Prices (i.e. accrued interest is not taken into account for arriving at such prices).',
  };
  protected tbillPriceForm = new FormGroup({
    sdate: new FormControl(''),
  });

  displayedColumnDW1 = ['srno', 'refid', 'date', 'rate', 'desc'];
  displayedColumnDW2 = ['isin', 'type', 'name', 'date', 'price'];

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
    this.tbillPriceForm!.get('sdate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getTbillPricesInit();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.tbillPriceForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getTbillPricesInit() {
    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'getTbillPricesInit',
        this.formGroupdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.tbillPriceRateList = data['data'];
          this.dataSource = new MatTableDataSource(this.tbillPriceRateList);
          this.dataSource!.paginator = this.paginator;
          this.currentDate =
            this.tbillPriceRateList[0].vdt || 'No Date Available';
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getTBillRates() {
    this.formGroupdata = this.tbillPriceForm.value;
    if (!isNaN(Date.parse(this.formGroupdata.sdate))) {
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
      .postRequestLegacy(
        FeatureList.equity,
        'gettbillrates',
        this.formGroupdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.tbillPriceRateList = data['data'];
          this.dataSource = new MatTableDataSource(this.tbillPriceRateList);
          this.dataSource!.paginator = this.paginator;
          this.currentDate =
            this.tbillPriceRateList[0].vdt || 'No Date Available';
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(ratelist: any, filename: any) {
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

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
