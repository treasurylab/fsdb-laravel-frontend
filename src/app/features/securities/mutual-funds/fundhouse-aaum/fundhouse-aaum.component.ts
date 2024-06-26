import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  faArrowsRotate,
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

export interface allmonth {
  id: any;
  name: string;
}
@Component({
  selector: 'app-fundhouse-aaum',
  templateUrl: './fundhouse-aaum.component.html',
  styleUrls: ['./fundhouse-aaum.component.scss'],
})
export class FundhouseAaumComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
  }
  protected pageInfo = {
    title: 'Fund House AAUM',
    content:
      'Average Asset Under Management (AAUM) published by the respective Fund Houses on a monthly basis.',
  };
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;
  protected tableChips: string[] = [];
  protected aumSchemeForm = new FormGroup({
    fhlist: new FormControl(''),
    month: new FormControl(''),
    year: new FormControl(''),
  });

  selectedYear: string = '';
  selectedMonth: string = '';
  selectedInfoYear: string = '';
  selectedInfoMonth: string = '';
  factsheetaumdata: any = [];
  aumSchemeFormparams: any = '';
  selectedfh = '';
  fundHousesData: any[] = [];
  years: Array<number> = [];
  filteredData: any[] = [];
  aumSchemeKeyword: string = '';
  recordDate: string | null | undefined;

  months: allmonth[] = [
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

  availableAumData: any = [];
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  unavailableData: Array<any> = [];

  aumSchemeSearchControl: FormControl = new FormControl();

  displayedColumns1 = [
    'no',
    // 'scheme_id',
    'scheme_name',
    'aum',
  ];
  searchInput: any;

  public constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.populateYears();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const currentMonth = (today.getMonth() + 1).toString(); // Months are 0-based, so add 1
    const currentYear = today.getFullYear().toString();
    this.aumSchemeForm!.get('month')!.setValue(currentMonth);
    this.aumSchemeForm!.get('year')!.setValue(currentYear);
    this.aumSchemeForm!.get('fhlist')!.setValue('All');
    this.managePortfolioMF();
    this.dataSource1.filterPredicate = (data: any, filter: string) => {
      return (
        data.refid.toLowerCase().includes(filter) ||
        data.bp_name.toLowerCase().includes(filter) ||
        data.sec_name.toLowerCase().includes(filter) ||
        data.aum_amount.toString().toLowerCase().includes(filter)
      );
    };
    this.getFactAAumInfo(false);
    this.getOnFactAAumInfo(false);
  }

  protected getFormControllers(name: string) {
    const ctrl = this.aumSchemeForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  managePortfolioMF() {
    this.apiService
      .getRequestLegacy(FeatureList.mf, 'managePortfolioMF')
      .pipe()
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            // this.alldata = data['res'];
            this.fundHousesData = [
              { id: 'All', name: 'All' },
              ...data['data']['listFund'],
            ];
            // console.log(this.fundHousesData);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private populateYears() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 50;
    for (let year = 2020; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  getFactAAumInfo(download: boolean) {
    this.aumSchemeFormparams = this.aumSchemeForm.value;
    let finalfh;
    if (this.selectedfh == 'All') {
      finalfh = 'All';
    } else {
      finalfh = this.selectedfh.split(':')[0].slice(0, -1);
    }

    this.tableChips = [];

    for (const key in this.aumSchemeFormparams) {
      if (this.aumSchemeFormparams[key] !== '') {
        let label = key;
        let value = this.aumSchemeFormparams[key];

        if (key === 'fhlist') {
          label = 'Fund House';
          value =
            this.fundHousesData.find((item) => item.id === value)?.value ||
            value;
        } else if (key === 'month') {
          label = 'Month';
          value =
            this.months.find((item) => item.id.toString() === value)?.name ||
            value;
        } else if (key === 'year') {
          label = 'Year';
        }

        this.tableChips.push(`${label}: ${value}`);
      }
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.mf,
        'getFactAAumData',
        this.aumSchemeFormparams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.availableAumData = data['data']['data'];
            this.dataSource1 = new MatTableDataSource(this.availableAumData);
            this.dataSource1.paginator = this.paginator;
            this.recordDate =
              data['data']['record_date'] || 'No Date Available';
            if (data['data']['data'].length > 0 && download) {
              const headerMapping: { [key: string]: string } = {
                id: 'ID',
                refid: 'Fund House ID',
                bp_name: 'Fund House Name',
                aum_amount: 'AAUM',
              };

              // Create a new array with customized headers
              const customizedRatelist = data['data']['data'].map(
                (row: { [key: string]: any }) => {
                  const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
                  for (const key in row) {
                    if (key === 'id' || key === 'year' || key === 'quarter') {
                      continue; // Skip these columns
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

              this.exportService.downloadFile(
                customizedRatelist,
                'Fundhouse_AAUM' + new Date().toISOString()
              );
            }
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  getOnFactAAumInfo(download: boolean) {
    this.aumSchemeFormparams = this.aumSchemeForm.value;
    let finalfh;
    if (this.selectedfh == 'All') {
      finalfh = 'All';
    } else {
      finalfh = this.selectedfh.split(':')[0].slice(0, -1);
    }
    //this.aumSchemeFormparams.fundhouse_id = finalfh;
    // console.log(this.aumSchemeFormparams);
    this.apiService
      .postRequestLegacy(
        FeatureList.mf,
        'getOnFactAAumData',
        this.aumSchemeFormparams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.availableAumData = data['data']['data'];
            this.dataSource1 = new MatTableDataSource(this.availableAumData);
            this.dataSource1.paginator = this.paginator;
            this.recordDate =
              data['data']['record_date'] || 'No Date Available';
            if (data['data']['data'].length > 0 && download) {
              const headerMapping: { [key: string]: string } = {
                id: 'ID',
                refid: 'Fund House ID',
                bp_name: 'Fund House Name',
                aum_amount: 'AAUM',
              };

              // Create a new array with customized headers
              const customizedRatelist = data['data']['data'].map(
                (row: { [key: string]: any }) => {
                  const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
                  for (const key in row) {
                    if (key === 'id' || key === 'year' || key === 'quarter') {
                      continue; // Skip these columns
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

              this.exportService.downloadFile(
                customizedRatelist,
                'Fundhouse_AAUM' + new Date().toISOString()
              );
            }
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sortAAUM(direction: 'asc' | 'desc'): void {
    // console.log(direction);
    // Convert aum_amount values to numbers for proper sorting
    this.dataSource1.data.forEach((item) => {
      if (typeof item.aum_amount === 'string') {
        item.aum_amount = parseFloat(item.aum_amount.replace(/,/g, ''));
      }
    });

    this.dataSource1.data = this.dataSource1.data.sort((a, b) => {
      const aValue = a.aum_amount;
      const bValue = b.aum_amount;

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // console.log('Sorted data:', this.dataSource.data);
    this.cdr.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!filterValue) {
      this.dataSource1.filter = '';
    } else {
      this.dataSource1.filter = filterValue;
    }
  }

  // protected openModal() {
  //   this.dialog.open(InfoModalComponent, {
  //     panelClass: 'custom-mat-dialog',
  //     data: {
  //       title: 'Fund House AAUM',
  //       content:
  //         'Average Asset Under Management (AAUM) published by the respective Fund Houses on a monthly basis.',
  //     },
  //   });
  // }
}
