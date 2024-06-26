import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';

Chart.register(...registerables);

@Component({
  selector: 'app-interest-rate-overview',
  templateUrl: './interest-rate-overview.component.html',
  styleUrls: ['./interest-rate-overview.component.scss'],
})
export class IntrestrateOverviewComponent implements OnInit, AfterViewInit {
  sofrrateList: any;
  dataset: any;
  category: any;
  repo: any;
  revrepo: any;
  rbiDate: any;
  sofr: any;
  sofrdate: any;
  d7: any;
  d14: any;
  m1: any;
  m2: any;
  m3: any;
  m4: any;
  m5: any;
  m6: any;
  m7: any;
  m8: any;
  m9: any;
  m10: any;
  m11: any;
  m12: any;
  constructor(
    private apiService: ApiService,
    protected dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  //for mclr graph
  @ViewChild('mclrChart') chartRef!: ElementRef;
  @ViewChild('mclrChartOneYear') mclrChartOneYearRef!: ElementRef;
  private chart!: Chart;
  private mclrChartOneYear!: Chart;
  private chartColors: string[] = [
    '#1C326B',
    '#528BFE',
    '#37C2CE',
    '#A7C7E7',
    '#808080',
  ];
  protected buttonNameList: Array<string> = [
    'ON',
    '1M',
    '3M',
    '6M',
    '1Y',
    '2Y',
    '3Y',
  ];
  protected selectedTenor: string = this.buttonNameList[0];

  //Values for the latest mclr for the 4 blocks
  protected bestMclr: string = '';
  protected rbiRepoRate: string = '';
  protected noOfBanks: string = '';
  protected noOfBpBanks: string = '';

  protected bestMclrBank: string = '';
  protected bestMclrRate: string = '';
  protected bestonMclr: string = '';

  private dashboardData: any;
  protected lastUpdated!: string;

  //Graph Values
  protected tenor6M: string = 'Overnight';
  protected tenor1Y: string = 'Overnight';

  //MCLR Latest Table
  protected dataSource: string[] = [];
  protected displayedColumns: string[] = [
    'bank_name',
    'frequency_type',
    'mclr_rate',
  ];

  protected dateToday = '';

  ngOnInit(): void {
    // this.getMclrLatestTable();
    this.getDashboardInfo();
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.TbillCurvrrate!.get('sdate')!.setValue(formattedDate);
    this.rbireporate!.get('sdate')!.setValue(formattedDate);
    this.rbireporate!.get('fromdate')!.setValue(formattedDate);
    this.rbireporate!.get('todate')!.setValue(formattedDate);
    // const formattedDate = today.toISOString().split('T')[0];
    this.sofrrate!.get('sdate')!.setValue(formattedDate);
    this.sofrrate!.get('fromdate')!.setValue(formattedDate);
    this.sofrrate!.get('todate')!.setValue(formattedDate);
    this.getSofrList();
    this.getRBIRateList();
    this.getTBillRateList();
    this.initializeTBillGraph();

    this.getMclrChartInfo('ON');
    this.setChart();
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  private getDashboardInfo() {
    //Function to get user
    this.apiService
      .postRequestLegacy(FeatureList.mclr, 'mclrDashboard')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dashboardData = data.data;
          this.rbiRepoRate = this.dashboardData['reporate'];
          this.noOfBanks = this.dashboardData['totalBanks'];
          this.noOfBpBanks = this.dashboardData['bpBanks'];
          this.lastUpdated = this.dashboardData['effectiveMCLR'];
          this.bestMclrBank =
            this.dashboardData['tenorwisebestbank'][0]['name'];
          this.bestMclrRate =
            this.dashboardData['tenorwisebestbank'][0]['mclr_rate'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getMclrChartInfo(tenor: string) {
    var datasetJson: any = [];
    //Function to get Chart
    const requestPayload = {
      tenor: tenor,
      interval: '6M',
    };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getTop5BanksComparision',
        requestPayload
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.selectedTenor = tenor;
          response.data['dataseries'].forEach((value: any, i: number) => {
            datasetJson.push({
              label: value['name'],
              data: value['data'],
              backgroundColor: this.chartColors[i],
              borderColor: this.chartColors[i],
              borderWidth: 2,
              fill: 'true',
            });
          });
          response.data['dataseries'] = datasetJson;

          this.updateChart(response.data, this.chart);
          this.tenor6M = this.tenorValueToString(tenor);
          //Josh here
          var bestBank = '';
          var bestMclrRate = 9999;
          datasetJson.forEach((bankItem: any, index: number) => {
            bankItem['data'].forEach((mclrRate: any) => {
              if (mclrRate < bestMclrRate) {
                bestBank = bankItem['label'];
                bestMclrRate = mclrRate;
              }
            });
          });
          this.bestMclrBank = bestBank;
          this.bestMclrRate = bestMclrRate.toString();

          //Josh ends
          var tenorIndex: any = Number(tenor[2]) - 1;
          var tempdata: any = JSON.parse(
            JSON.stringify(this.dataSource[tenorIndex])
          );
          this.bestMclrBank = tempdata['bank_name'];
          this.bestMclrRate = tempdata['mclr_rate'];
        },

        error: (err: any) => {
          alert('No Data Found!');
        },
      });
  }

  getMclrChartOneYearInfo(tenor: string) {
    var datasetJsonOneYear: any = [];
    //Function to get Chart
    const requestPayload = {
      tenor: tenor,
      interval: '1Y',
    };
    this.apiService
      .postRequestLegacy(
        FeatureList.mclr,
        'getTop5BanksComparision',
        requestPayload
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          var i = 0;
          data['dataseries'].forEach((value: any) => {
            datasetJsonOneYear.push({
              label: value['name'],
              data: value['data'],
              backgroundColor: this.chartColors[i],
              borderColor: this.chartColors[i],
              borderWidth: 2,
              fill: 'true',
            });
            i++;
          });
          data['dataseries'] = datasetJsonOneYear;
          this.updateChart(data, this.mclrChartOneYear);
          this.tenor1Y = this.tenorValueToString(tenor);
        },

        error: (err: any) => {
          alert('No Data Found!');
        },
      });
  }

  updateChart(data: any, chart: Chart) {
    chart.data.datasets = data['dataseries'];
    chart.data.labels = data['months'];
    chart.update();
  }

  setChart() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
          {
            label: 'Loading',
            data: [5, 5, 5, 5, 5, 5, 5],
            backgroundColor: '#1C326B',
            borderColor: '#1C326B',
            borderWidth: 2,
            fill: 'true',
          },
        ],
      },
      options: {
        elements: {
          line: {
            tension: 0.2,
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
    this.mclrChartOneYear = new Chart(this.mclrChartOneYearRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
          {
            label: 'Loading',
            data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            backgroundColor: '#1C326B',
            borderColor: '#1C326B',
            borderWidth: 2,
            fill: 'true',
          },
        ],
      },
      options: {
        elements: {
          line: {
            tension: 0.2,
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
    this.getMclrChartInfo('001');
    this.getMclrChartOneYearInfo('001');
  }

  tenorValueToString(tenor: string) {
    switch (tenor) {
      case 'ON':
        return 'Overnight';
      case '1M':
        return '1 Month';
      case '3M':
        return '3 Months';
      case '6M':
        return '6 Months';
      case '1Y':
        return '1 Year';
      case '2Y':
        return '2 Years';
      case '3Y':
        return '3 Years';
      case '5Y':
        return '5 Years';
      default:
        return 'Invalid Tenor';
    }
  }

  tbillrateData: any[] = [];
  selectedOption: string = 'A';
  keyDate: any;
  datediff: any;
  exportmclr: boolean = false;
  tbillrateList: any = [];
  tbillformdata: any = [];
  formattedDate: any;

  @ViewChild('tbillChart')
  tbillChart!: ElementRef;
  miborrateList: any = [];
  formGroupdata: any = [];
  graphData: any = [];
  currentDate: string = 'No Date Available';

  TbillCurvrrate = new FormGroup({
    sdate: new FormControl(''),
  });

  private getTBillRateList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.benchmark,
        'getTbillRate'
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.tbillrateList = response.data.data;
          this.graphData = response.data.data;
          this.currentDate =
            this.graphData[0].record_date || 'No Date Available';
          this.generateChart();
          this.exportmclr = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private initializeTBillGraph() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.benchmark,
        'getTBillRate',
        {
          graph_data: true,
        }
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.graphData = response.data.data;
          this.currentDate =
            this.graphData[0].record_date || 'No Date Available';
          this.d7 = this.graphData[0].d7;
          this.d14 = this.graphData[0].d14;
          this.m1 = this.graphData[0].m1;
          this.m2 = this.graphData[0].m2;
          this.m3 = this.graphData[0].m3;
          this.m4 = this.graphData[0].m4;
          this.m5 = this.graphData[0].m5;
          this.m6 = this.graphData[0].m6;
          this.m7 = this.graphData[0].m7;
          this.m8 = this.graphData[0].m8;
          this.m9 = this.graphData[0].m9;
          this.m10 = this.graphData[0].m10;
          this.m11 = this.graphData[0].m11;
          this.m12 = this.graphData[0].m12;

          console.log(this.d7);

          this.exportmclr = true;
          this.generateChart();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  tbillGraphData() {
    this.formGroupdata = this.TbillCurvrrate.value;
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
    this.formGroupdata['graph_data'] = true;
    this.apiService
      .postRequestLegacy(this.formGroupdata, 'getTBillRate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.graphData = data.data;
          this.currentDate =
            this.graphData[0].record_date || 'No Date Available';
          this.exportmclr = true;
          this.generateChart();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  generateChart() {
    const chartData = {
      labels: [
        '7D',
        '14D',
        '1M',
        '2M',
        '3M',
        '4M',
        '5M',
        '6M ',
        '7M ',
        '8M ',
        '9M',
        '10M',
        '11M',
        '12M',
      ],
      datasets: [
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
      ],
    };

    const canvas = this.tbillChart.nativeElement;
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 400;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            min: Math.min(...chartData.datasets[0].data) - 0.1,
            suggestedMax: Math.max(...chartData.datasets[0].data) + 0.1,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  reporateData: any[] = [];
  fromDate: any;
  toDate: any;
  endDate: any;
  fromDateD: any;
  rbirateList: any = [];
  rbilformdata: any = [];
  rbireporate = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    sdate: new FormControl(''),
    selectedOption: new FormControl(''),
  });

  getRBIRateList() {
    this.rbilformdata = this.rbireporate.value;

    if (
      !isNaN(Date.parse(this.rbilformdata.sdate)) ||
      !isNaN(Date.parse(this.rbilformdata.fromdate))
    ) {
      if (this.selectedOption == 'A') {
        this.rbilformdata.sdate = new Date(this.rbilformdata.sdate);
        this.rbilformdata.sdate = this.datePipe.transform(
          this.rbilformdata.sdate,
          'yyyy-MM-dd'
        );
        this.rbilformdata.selectedOption = 'A';
      } else {
        this.rbilformdata.fromdate = new Date(this.rbilformdata.fromdate);
        this.rbilformdata.fromdate = this.datePipe.transform(
          this.rbilformdata.fromdate,
          'yyyy-MM-dd'
        );
        this.rbilformdata.todate = new Date(this.rbilformdata.todate);
        this.rbilformdata.todate = this.datePipe.transform(
          this.rbilformdata.todate,
          'yyyy-MM-dd'
        );
      }
    } else {
      console.log('DAte not valid');
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getRbiReporate',
        this.rbilformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.rbirateList = data.data;
          this.rbiDate = this.rbirateList[0].rdate || 'No Date Available';
          this.repo = this.rbirateList[0].reporate || 'No Date Available';
          this.revrepo = this.rbirateList[0].revreporate || 'No Date Available';
          console.log(this.rbirateList);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sofrrate = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    sdate: new FormControl(''),
    selectedOption: new FormControl(''),
  });

  getSofrList() {
    this.rbilformdata = this.sofrrate.value;

    if (
      !isNaN(Date.parse(this.rbilformdata.sdate)) ||
      !isNaN(Date.parse(this.rbilformdata.fromdate))
    ) {
      if (this.selectedOption == 'A') {
        this.rbilformdata.sdate = new Date(this.rbilformdata.sdate);
        this.rbilformdata.sdate = this.datePipe.transform(
          this.rbilformdata.sdate,
          'yyyy-MM-dd'
        );
        this.rbilformdata.selectedOption = 'A';
      } else {
        this.rbilformdata.fromdate = new Date(this.rbilformdata.fromdate);
        this.rbilformdata.fromdate = this.datePipe.transform(
          this.rbilformdata.fromdate,
          'yyyy-MM-dd'
        );
        this.rbilformdata.todate = new Date(this.rbilformdata.todate);
        this.rbilformdata.todate = this.datePipe.transform(
          this.rbilformdata.todate,
          'yyyy-MM-dd'
        );
      }
    } else {
      console.log('Date not valid');
    }

    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getSofrRate',
        this.rbilformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.rbirateList = data.data;

          if (this.rbirateList.length > 0) {
            const latestEntry = this.rbirateList[0];

            if (latestEntry.rate === null) {
              const secondLatestEntry =
                this.rbirateList.length > 1 ? this.rbirateList[1] : null;

              if (secondLatestEntry !== null) {
                this.sofr = secondLatestEntry.rate || 'No Data Available';
                this.sofrdate =
                  secondLatestEntry.record_date || 'No Date Available';
              } else {
                this.sofr = 'No Data Available';
                this.sofrdate = 'No Date Available';
              }
            } else {
              // Use the rate from the latest entry
              this.sofr = latestEntry.rate || 'No Data Available';
              this.sofrdate = latestEntry.record_date || 'No Date Available';
            }

            console.log(this.rbirateList);
          } else {
            console.log('No data available');
          }
        },
        error: (error: any) => {
          console.error('Error fetching SOFR rates:', error);
        },
      });
  }
}
