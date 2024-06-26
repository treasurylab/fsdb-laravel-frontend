import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-indices',
  templateUrl: './indices.component.html',
  styleUrls: ['./indices.component.scss'],
})
export class IndicesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns = [
    'date',
    'symbol',
    'open',
    'high',
    'low',
    'prevclose',
  ];

  protected indicesInfo = {
    title: 'Indices',
    content: 'End of day indices prices from NSE and BSE.',
  };
  protected tabs = ['Key date', 'Range'];
  protected selectedTab = 'Key date';
  protected linkIcon = faLink;
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;
  protected tableChips: string[] = [];

  private formattedDate = new Date().toISOString().split('T')[0];
  protected indicesFormGrp = new FormGroup({
    selectedOption: new FormControl('A', Validators.required),
    fromDate: new FormControl(this.formattedDate, Validators.required),
    toDate: new FormControl(this.formattedDate),
    indexOption: new FormControl('nifty50'),
  });
  protected indexOption = [
    { id: 'nifty50', value: 'Nifty 50' },
    { id: 'nifty200', value: 'Nifty 200' },
    { id: 'sensex50', value: 'Sensex 50' },
    { id: 'sensex200', value: 'Sensex 200' },
  ];

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getIndexPriceList();
  }

  protected onTabChanged(selectedTab: string) {
    console.log('tab changed' + selectedTab);

    this.selectedTab = selectedTab;
    if (selectedTab === this.tabs[0]) {
      this.indicesFormGrp.get('toDate')?.clearValidators();
      this.indicesFormGrp.get('indexOption')?.clearValidators();
      this.indicesFormGrp.get('toDate')?.updateValueAndValidity();
      this.indicesFormGrp.get('indexOption')?.updateValueAndValidity();
      this.indicesFormGrp.patchValue({
        selectedOption: 'A',
        fromDate: this.formattedDate,
        toDate: null,
        indexOption: null,
      });
    } else {
      this.indicesFormGrp.get('toDate')?.setValidators(Validators.required);
      this.indicesFormGrp
        .get('indexOption')
        ?.setValidators(Validators.required);
      this.indicesFormGrp.get('toDate')?.updateValueAndValidity();
      this.indicesFormGrp.get('indexOption')?.updateValueAndValidity();
      this.indicesFormGrp.patchValue({
        selectedOption: 'B',
        fromDate: this.formattedDate,
        toDate: this.formattedDate,
        indexOption: 'nifty50',
      });
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.indicesFormGrp.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private getIndexPriceList() {
    const keyDate = this.datePipe.transform(this.formattedDate, 'dd.MM.yyyy');
    this.tableChips = [`Key Date: ${keyDate}`];
    this.apiService
      .getRequestLegacy(FeatureList.equity, 'getIndicesData')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dataSource.data = data['data'];
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  protected getIndexData() {
    if (!this.indicesFormGrp.valid) {
      alert('Form is invalid');
      return;
    }
    const eqformdata: any = this.indicesFormGrp.value;
    if (!isNaN(Date.parse(eqformdata.fromDate))) {
      eqformdata.fromDate = new Date(eqformdata.fromDate);
      eqformdata.fromDate = this.datePipe.transform(
        eqformdata.fromDate,
        'yyyy-MM-dd'
      );
      if (eqformdata.selectedOption === 'B') {
        eqformdata.toDate = new Date(eqformdata.toDate);
        eqformdata.toDate = this.datePipe.transform(
          eqformdata.toDate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      const formValues = this.indicesFormGrp.value;
      if (formValues.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            formValues.fromDate,
            'dd.MM.yyyy'
          )}`
        );
      } else if (formValues.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            formValues.fromDate,
            'dd.MM.yyyy'
          )}`
        );
        this.tableChips.push(
          `To Date: ${this.datePipe.transform(formValues.toDate, 'dd.MM.yyyy')}`
        );
        this.tableChips.push(
          `Index Option: ${
            this.indexOption.find(
              (option) => option.id === formValues.indexOption
            )?.value
          }`
        );
      }

      this.apiService
        .postRequestLegacy(FeatureList.equity, 'getIndicesData', eqformdata)
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            this.dataSource.data = data['data'];
            this.dataSource.paginator = this.paginator;
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    }
  }

  protected exportToCsv(ratelist: any, filename: any) {
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      symbol: 'Index',
      open: 'Open',
      high: 'High',
      low: 'Low',
      prev_close: 'Previous Close',
    };

    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {};
      for (const key in row) {
        if (key !== 'id' && key !== 'cid' && key !== 'cdt' && key !== 'close') {
          if (headerMapping.hasOwnProperty(key)) {
            newRow[headerMapping[key]] = row[key];
          } else {
            newRow[key] = row[key];
          }
        }
      }
      return newRow;
    });

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
