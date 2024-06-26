import { Component, OnInit, ViewChild } from '@angular/core';
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
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faLink,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sdl-rates',
  templateUrl: './sdl-rates.component.html',
  styleUrls: ['./sdl-rates.component.scss'],
})
export class SdlRatesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected filterIcon = faFilter;
  protected linkIcon = faLink;
  protected clearIcon = faEraser;
  protected refreshIcon = faArrowsRotate;
  protected selectedOption: string = 'A';
  protected exportmSDLData: boolean = false;
  protected sdlRateList!: MatTableDataSource<any>;
  protected cgrpId?: string | null;
  protected displayedColumnDW!: Array<string>;
  protected currentDate?: string;
  protected queryForm!: FormGroup;
  protected tableChips: string[] = [];
  protected displayedColumns!: Array<string>;
  protected pageInfo = {
    title: 'SDL Rate',
    content:
      'FBIL publishes on a daily basis, on all Mumbai business days, the prices/YTM for State Development Loans(SDL) with effect from March 31, 2018. The rates are announced at around 7 P.M. The valuation rates of SDLs are computed based on the transaction level data on SDL and interpolation/extrapolation methods. FBIL calculates SDL Valuation in-house.',
  };

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
    this.queryForm = this.formBuilder.group({
      selectedOption: ['A', Validators.required],
      fromdate: [formattedDate, Validators.required],
      todate: [formattedDate, Validators.required],
    });
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getSdlList();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.queryForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private pageSetup() {
    this.sdlRateList = new MatTableDataSource<any>();
    this.cgrpId = localStorage.getItem('cgrp_id');
    if (this.cgrpId !== '28') {
      this.displayedColumns = [
        'date',
        'isin_no',
        'coupon',
        'maturity_date',
        'price',
        'ytm',
      ];
    } else {
      this.displayedColumns = ['date', 'isin_no', 'price'];
    }
  }

  private getSdlList() {
    this.apiService
      .getRequestLegacy(FeatureList.benchmark, 'getFbilSdlRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sdlRateList = new MatTableDataSource<any>(data['data']['data']);
          this.dataSource = this.sdlRateList;
          this.dataSource!.paginator = this.paginator;
          this.currentDate = data['data']['todate'] || undefined;
          this.exportmSDLData = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getSdlRates() {
    this.tableChips = [];
    const fromDate = this.datePipe.transform(
      this.queryForm.value.fromdate,
      'dd.MM.yyyy'
    );
    const toDate = this.datePipe.transform(
      this.queryForm.value.todate,
      'dd.MM.yyyy'
    );

    if (this.queryForm.value.selectedOption === 'A') {
      this.tableChips.push(`Key Date: ${fromDate}`);
    } else if (this.queryForm.value.selectedOption === 'B') {
      this.tableChips.push(`From Date: ${fromDate}`);
      this.tableChips.push(`To Date: ${toDate}`);
    }
    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getFbilSdlRates',
        this.queryForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sdlRateList = new MatTableDataSource<any>(data['data']['data']);
          this.dataSource = this.sdlRateList;
          this.dataSource!.paginator = this.paginator;
          this.currentDate = data['data']['todate'] || undefined;
          this.exportmSDLData = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      isin_no: 'ISIN',
      desc: 'Description',
      coupon: 'Coupon',
      maturity_date: 'Maturity Date',
      price: 'Price',
      ytm: 'YTM',
    };

    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
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
    });

    this.exportService.downloadFile(customizedRatelist, filename);
  }

  protected openModal() {
    this.dialog.open(InfoModalComponent, {
      panelClass: 'custom-mat-dialog',
      data: {
        title: 'SDL Rate',
        content:
          'FBIL publishes on a daily basis, on all Mumbai business days, the prices/YTM for State Development Loans(SDL) with effect from March 31, 2018. The rates are announced at around 7 P.M. The valuation rates of SDLs are computed based on the transaction level data on SDL and interpolation/extrapolation methods. FBIL calculates SDL Valuation in-house.',
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
