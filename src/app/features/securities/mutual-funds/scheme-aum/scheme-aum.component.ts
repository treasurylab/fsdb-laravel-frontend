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
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-schem-eaum',
  templateUrl: './scheme-aum.component.html',
  styleUrls: ['./scheme-aum.component.scss'],
})
export class SchemeAumComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected pageInfo = {
    title: 'Scheme AUM',
    content:
      'Asset Under Management (AUM) of each Fund house published by the respective Fund Houses on a monthly basis.',
  };
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;
  protected tableChips: string[] = [];
  protected aumSchemeForm = new FormGroup({
    fhlist: new FormControl(''),
    cat1list: new FormControl(''),
    cat2list: new FormControl(''),
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
  dataon: string = 'No Date Available';

  months = [
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
  // dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  dataSource = new MatTableDataSource<any>();
  unavailableData: Array<any> = [];

  aumSchemeSearchControl: FormControl = new FormControl();
  aumSchemeKeyword: string = '';

  displayedColumns1 = ['no', 'scheme_id', 'scheme_name', 'aum'];
  categoryList1 = [
    { id: 'All', value: 'All' },
    { id: 'Debt Scheme', value: 'Debt' },
    { id: 'Equity Scheme', value: 'Equity' },
    { id: 'Hybrid Scheme', value: 'Hybrid' },
    { id: 'Other Scheme', value: 'Other' },
  ];
  categoryList2 = [
    { id: 'All', value: 'All' },
    { id: 'direct', value: 'Direct Growth' },
    { id: 'regular', value: 'Regular' },
  ];

  public constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.populateYears();
    this.managePortfolioMF();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const currentMonth = (today.getMonth() + 1).toString(); // Months are 0-based, so add 1
    const currentYear = today.getFullYear().toString();
    this.aumSchemeForm!.get('month')!.setValue(currentMonth);
    this.aumSchemeForm!.get('year')!.setValue(currentYear);
    this.aumSchemeForm!.get('fhlist')!.setValue('All');
    this.aumSchemeForm!.get('cat1list')!.setValue('All');
    this.aumSchemeForm!.get('cat2list')!.setValue('All');
    this.getSchemeAumInfo(false);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  getSchemeAumInfo(download: boolean) {
    this.aumSchemeFormparams = this.aumSchemeForm.value;
    let finalfh;
    if (this.selectedfh == 'All') {
      finalfh = 'All';
    } else {
      finalfh = this.selectedfh.split(':')[0].slice(0, -1);
    }
    this.aumSchemeFormparams.fundhouse_id = finalfh;
    // console.log(this.aumSchemeFormparams);
    this.tableChips = [];

    for (const key in this.aumSchemeFormparams) {
      if (this.aumSchemeFormparams[key] !== '') {
        let label = key;
        let value = this.aumSchemeFormparams[key];

        if (key === 'cat1list') {
          label = 'AMFI Type';
          value =
            this.categoryList1.find((item) => item.id === value)?.value ||
            value;
        } else if (key === 'cat2list') {
          label = 'Scheme Type';
          value =
            this.categoryList2.find((item) => item.id === value)?.value ||
            value;
        } else if (key === 'fhlist') {
          label = 'Fund House';
          value =
            this.fundHousesData.find((item) => item.id === value)?.name ||
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
      .postRequestLegacy(FeatureList.mf, 'getAumData', this.aumSchemeFormparams)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.availableAumData = data['data']['data'];
            this.dataon = data['data']['pf_month'] || 'No Date Available';
            this.dataSource = new MatTableDataSource(this.availableAumData);
            this.dataSource.paginator = this.paginator;

            if (data['data']['data'].length > 0 && download) {
              const headerMapping: { [key: string]: string } = {
                record_date: 'Date',
                scheme_id: 'Scheme ID',
                scheme_name: 'Scheme Name',
                net_asset_value: 'AUM',
                // Add more mappings as needed
              };

              // Create a new array with customized headers
              const customizedRatelist = data['data']['data'].map(
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

              this.exportService.downloadFile(customizedRatelist, 'Scheme Aum');
            }
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sortAUM(direction: 'asc' | 'desc'): void {
    // console.log(direction);
    // Convert aum values to numbers for proper sorting
    this.dataSource.data.forEach((item) => {
      if (typeof item.aum === 'string') {
        item.aum = parseFloat(item.aum.replace(/,/g, ''));
      }
    });

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const aValue = a.aum;
      const bValue = b.aum;

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // console.log('Sorted data:', this.dataSource.data);
    this.cdr.detectChanges();
  }

  private populateYears() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 50;
    for (let year = 2020; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!filterValue) {
      this.dataSource.data = this.availableAumData;
    } else {
      this.filteredData = this.availableAumData.filter((item: any) => {
        return (
          item.scheme_id.toString().toLowerCase().includes(filterValue) ||
          item.scheme_name.toLowerCase().includes(filterValue) ||
          item.aum.toString().toLowerCase().includes(filterValue)
        );
      });

      this.dataSource.data = this.filteredData;
    }
  }
}
