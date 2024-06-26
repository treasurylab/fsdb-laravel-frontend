import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  faCloudArrowDown,
  faEraser,
  faFilter,
  faLink,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { GraphOptions } from 'src/app/shared/models/graphs/graph-options';

@Component({
  selector: 'app-tbill-curve',
  templateUrl: './tbill-curve.component.html',
  styleUrls: ['./tbill-curve.component.scss'],
})
export class TbillCurveComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected tbillrateData: any[] = [];
  protected datediff: any;
  protected tBillRateList = new MatTableDataSource<any>();
  protected tbillformdata: any = [];
  protected tableChips: string[] = [];

  @ViewChild('tbillChart')
  tbillChart!: ElementRef;

  // miborrateList!: MatTableDataSource<any>;
  formGroupdata: any = [];
  graphData: any = [];
  currentDate: string = 'No Date Available';

  protected tabs = ['T-Bill Rates', 'Graph'];
  protected activeTab = 'T-Bill Rates';
  protected chartOptions?: GraphOptions;
  protected tBillRateForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });
  protected tBillGraphForm = new FormGroup({
    fromdate: new FormControl(''),
  });
  protected filterIcon = faFilter;
  protected searchIcon = faSearch;
  protected clearIcon = faEraser;
  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected pageInfo = {
    title: 'T-Bill Curve',
    content:
      'FBIL announces the benchmark rates for Treasury Bills (FBIL-TBILL) on a daily basis except Saturdays, Sundays and public holidays at 5.30 PM. FBIL has developed the FBIL-TBILL, a new benchmark for the money market based on Treasury bills traded in the market. FBIL-TBILL is announced for seven tenors of 14 days, 1 month, 2 months, 3 months, 6 months, 9 months and 12 months. FBIL-TBILL is calculated on the basis of secondary market trades executed and reported up to 5 PM on the NDS-OM Platform. All trades having a value of Rs.5 crores and above and a minimum of three trades in each tenor are considered for calculating the benchmark for each tenor. If there are less than 3 trades in a particular tenor, the data is augmented by including the executable orders on the NDS OM Platform. The CCIL is the Calculating Agent.',
  };

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
    this.tBillRateForm!.get('fromdate')!.setValue(formattedDate);
    this.tBillRateForm!.get('todate')!.setValue(formattedDate);
    this.tBillGraphForm!.get('fromdate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getTBillRateList();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.tBillGraphForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected onTabChanged(tab: string) {
    this.activeTab = tab;
  }

  protected displayedColumns = [
    'date',
    'days7',
    'days14',
    'month1',
    'month2',
    'month3',
    'month4',
    'month5',
    'month6',
    'month7',
    'month8',
    'month9',
    'month10',
    'month11',
    'month12',
  ];

  protected getTbillDownload() {
    this.tbillformdata = this.tBillRateForm.value;

    if (!isNaN(Date.parse(this.tbillformdata.fromdate))) {
      this.tbillformdata.fromdate = new Date(this.tbillformdata.fromdate);
      this.tbillformdata.fromdate = this.datePipe.transform(
        this.tbillformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.tbillformdata.selectedOption === 'B') {
        this.tbillformdata.todate = new Date(this.tbillformdata.todate);
        this.tbillformdata.todate = this.datePipe.transform(
          this.tbillformdata.todate,
          'yyyy-MM-dd'
        );
      }
      this.tableChips = [];
      if (this.tbillformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.tbillformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.tbillformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.tbillformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.tbillformdata.todate,
            'dd.MM.yyyy'
          )}`
        );
      }
    } else {
      console.log('Date not valid');
    }

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.benchmark,
        'getTbillRate',
        this.tbillformdata
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.tBillRateList.data = response.data.data;
          this.tBillRateList.paginator = this.paginator;
          this.graphData = response.data.data;
          this.currentDate =
            this.graphData[0].record_date || 'No Date Available';
          this.datediff = response['data']['delay'];
          this.generateChart();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getTBillRateList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.benchmark,
        'getTbillRate'
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.tBillRateList.data = response.data.data;
          this.tBillRateList.paginator = this.paginator;
          this.graphData = response.data.data;
          this.currentDate =
            this.graphData[0].record_date || 'No Date Available';
          this.generateChart();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected tbillGraphData() {
    this.formGroupdata = this.tBillGraphForm.value;
    if (!isNaN(Date.parse(this.formGroupdata.fromdate))) {
      this.formGroupdata.fromdate = new Date(this.formGroupdata.fromdate);
      this.formGroupdata.fromdate = this.datePipe.transform(
        this.formGroupdata.fromdate,
        'yyyy-MM-dd'
      );
    }
    this.formGroupdata['selectedOption'] = 'A';
    this.formGroupdata['graph_data'] = true;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.benchmark,
        'getTbillRate',
        this.formGroupdata
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.graphData = response.data.data;
          this.currentDate =
            this.graphData[0].record_date || 'No Date Available';
          this.generateChart();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv() {
    // Get the data array from the MatTableDataSource
    const data = this.tBillRateList.data;

    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      record_date: 'Record Date',
      d7: '7 Days',
      d14: '14 Days',
      m1: '1 Month',
      m2: '2 Months',
      m3: '3 Months',
      m4: '4 Months',
      m5: '5 Months',
      m6: '6 Months',
      m7: '7 Months',
      m8: '8 Months',
      m9: '9 Months',
      m10: '10 Months',
      m11: '11 Months',
      m12: '12 Months',
    };

    // Create a new array with customized headers
    const customizedRatelist = data.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {};
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
    this.exportService.downloadFile(
      customizedRatelist,
      `TBillRate_${new Date().toISOString()}`
    );
  }

  private generateChart() {
    const chartLabels = [
      '7 Days',
      '14 Days',
      '1 Month',
      '2 Months',
      '3 Months',
      '4 Months',
      '5 Months',
      '6 Months',
      '7 Months',
      '8 Months',
      '9 Months',
      '10 Months',
      '11 Months',
      '12 Months',
    ];
    const chartDatasets = [
      {
        label: 'T-Bill Rates',
        data: [
          this.graphData[0].d7,
          this.graphData[0].d14,
          this.graphData[0].m1,
          this.graphData[0].m2,
          this.graphData[0].m3,
          this.graphData[0].m4,
          this.graphData[0].m5,
          this.graphData[0].m6,
          this.graphData[0].m7,
          this.graphData[0].m8,
          this.graphData[0].m9,
          this.graphData[0].m10,
          this.graphData[0].m11,
          this.graphData[0].m12,
        ],
        borderColor: 'rgb(28 50 107)',
        borderWidth: 3,
        fill: false,
      },
    ];
    const minData = Math.floor(Math.min(...chartDatasets[0].data) * 10) / 10;
    const maxData = Math.ceil(Math.max(...chartDatasets[0].data) * 10) / 10;
    this.chartOptions = {
      labels: chartLabels,
      datasets: chartDatasets,
      legend: 'none',
      xScale: {
        grid: {
          display: false,
        },
      },
      yScale: {
        beginAtZero: false,
        suggestedMin: minData - 0.1,
        suggestedMax: maxData + 0.1,
        ticks: {
          stepSize: 0.1,
        },
        grid: {
          display: false,
        },
      },
    };
  }
}
