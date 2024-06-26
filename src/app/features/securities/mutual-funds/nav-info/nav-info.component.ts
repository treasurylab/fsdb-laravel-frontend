import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { ExportService } from 'src/app/core/services/export.service';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
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
  selector: 'app-nav-info',
  templateUrl: './nav-info.component.html',
  styleUrls: ['./nav-info.component.scss'],
})
export class NavInfoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  protected pageInfo = {
    title: 'NAV',
    content:
      'NAV prices of various schemes published by AMFI on every trading day at 11 pm on the same day.',
  };
  protected navInfoData = new Array<any>();
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected navInfoForm = new FormGroup({
    fhlist: new FormControl(''),
    amfitype: new FormControl(''),
    schemetype: new FormControl(''),
    sdate: new FormControl(''),
    sebilist: new FormControl(''),
  });
  protected navInfoFormParams: any = [];
  protected fundHousesData: any[] = [];
  protected filteredData: any[] = [];
  protected sebicatgList: any = [];
  protected sebiList: any = [];
  protected tableChips: string[] = [];
  protected selectedFundHouseName: string = 'test';
  protected dataSource: MatTableDataSource<any> = new MatTableDataSource();
  protected displayedColumns1 = [
    'record_date',
    'scheme_id',
    'scheme_name',
    'nav',
    'AUM',
  ];
  protected categoryList1 = [
    { id: 'All', value: 'All' },
    { id: 'Debt Scheme', value: 'Debt' },
    { id: 'Equity Scheme', value: 'Equity' },
    { id: 'Hybrid Scheme', value: 'Hybrid' },
    { id: 'Other Scheme', value: 'Other' },
  ];
  protected categoryList2 = [
    { id: 'All', value: 'All' },
    { id: 'direct', value: 'Direct' },
    { id: 'regular', value: 'Regular' },
  ];
  constructor(
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private exportService: ExportService,
    protected dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.managePortfolioMF();
    this.getSebiCatgGroupList();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const formattedDate = today.toISOString().split('T')[0];
    this.navInfoForm!.get('sdate')!.setValue(formattedDate);
    this.navInfoForm!.get('fhlist')!.setValue('All');
    this.navInfoForm!.get('amfitype')!.setValue('All');
    this.navInfoForm!.get('schemetype')!.setValue('All');
    this.navInfoForm!.get('sebilist')!.setValue('All');
    this.navDataView(false);
    this.navInfoForm
      .get('amfitype')
      ?.valueChanges.subscribe((selectedOptionId) => {
        this.getSebiCatgList(selectedOptionId);
      });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.navInfoForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected updateChips(name: string) {
    console.log(name);
  }

  protected getSebiCatgList(selectedOptionId: any): void {
    const requestParams = { selectedOptionId };
    this.apiService
      .postRequestLegacy(FeatureList.mf, 'getSebiCatgList', requestParams)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.sebiList = [{ code: 'All', tname: 'All' }, ...data['data']];
          console.log(this.sebiList);
        },
      });
  }

  private managePortfolioMF() {
    this.apiService
      .getRequestLegacy(FeatureList.mf, 'managePortfolioMF')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.fundHousesData = [
              { id: 'All', name: 'All' },
              ...data['data']['listFund'],
            ];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getSebiCatgGroupList() {
    this.apiService
      .getRequestLegacy(FeatureList.mf, 'getSebiCatgGroupList')
      .pipe()
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.sebicatgList = [{ code: 'All', name: 'All' }, ...data['data']];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected navDataView(download: boolean) {
    this.navInfoFormParams = this.navInfoForm.value;
    let finalfh: any = this.navInfoForm.get('fhlist')?.value;
    if (finalfh == 'All') {
      finalfh = 'All';
    } else {
      finalfh = finalfh.split(':')[0].slice(0, -1);
    }
    if (!isNaN(Date.parse(this.navInfoFormParams.sdate))) {
      this.navInfoFormParams.sdate = new Date(this.navInfoFormParams.sdate);
      this.navInfoFormParams.sdate = this.datePipe.transform(
        this.navInfoFormParams.sdate,
        'yyyy-MM-dd'
      );
      this.navInfoFormParams.fundhouse_id = finalfh;
    } else {
      console.log('Date not valid');
    }

    this.tableChips = [];

    for (const key in this.navInfoFormParams) {
      if (key !== 'fundhouse_id' && this.navInfoFormParams[key] !== '') {
        // Exclude fundhouse_id
        let label = key;
        if (key === 'fhlist') {
          label = 'Fund House';
        } else if (key === 'amfitype') {
          label = 'AMFI Type';
        } else if (key === 'schemetype') {
          label = 'Scheme Type';
        } else if (key === 'sdate') {
          label = 'Date';
        } else if (key === 'sebilist') {
          label = 'SEBI Category';
        }
        //Special conditions for data formatting;
        // console.log(key + ':' + this.navInfoFormParams[key]);

        if (key === 'fhlist' && this.navInfoFormParams[key] !== 'All') {
          console.log(this.fundHousesData);
          const fundHouse = this.fundHousesData.find(
            (fh: any) => fh['id'] == this.navInfoFormParams[key]
          );
          this.tableChips.push(`${label}: ${fundHouse['name']}`);
          continue;
        }
        this.tableChips.push(`${label}: ${this.navInfoFormParams[key]}`);
      }
    }
    this.apiService
      .postRequestLegacy(FeatureList.mf, 'navInfoData', this.navInfoFormParams)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.navInfoData = data['data'];
            this.dataSource.data = this.navInfoData;
            if (this.navInfoData.length > 0 && download) {
              const headerMapping: { [key: string]: string } = {
                record_date: 'Date',
                scheme_id: 'Scheme ID',
                scheme_name: 'Scheme Name',
                net_asset_value: 'NAV',
                factsheet_AUM: 'AUM',
              };

              // Create a new array with customized headers
              const customizedRatelist = this.navInfoData.map(
                (row: { [key: string]: any }) => {
                  const newRow: { [key: string]: any } = {};
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

              this.exportService.downloadFile(
                customizedRatelist,
                'Download_Navdata' + new Date().toISOString()
              );
            }
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sortAUM(direction: 'asc' | 'desc'): void {
    this.dataSource.data.forEach((item) => {
      if (typeof item.factsheet_AUM === 'string') {
        item.factsheet_AUM = parseFloat(item.factsheet_AUM.replace(/,/g, ''));
      }
    });

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const aValue = a.factsheet_AUM;
      const bValue = b.factsheet_AUM;

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    this.cdr.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!filterValue) {
      this.dataSource.data = this.navInfoData;
    } else {
      this.filteredData = this.navInfoData.filter((item: any) => {
        return (
          item.record_date.toLowerCase().includes(filterValue) ||
          item.scheme_id.toString().toLowerCase().includes(filterValue) ||
          item.scheme_name.toLowerCase().includes(filterValue) ||
          item.net_asset_value.toString().toLowerCase().includes(filterValue)
        );
      });

      this.dataSource.data = this.filteredData;
    }
  }
}
