import { AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { HttpErrorResponse } from '@angular/common/http';
import { GraphOptions } from 'src/app/shared/models/graphs/graph-options';

Chart.register(...registerables);

@Component({
  selector: 'app-mclr-dashboard',
  templateUrl: './mclr-dashboard.component.html',
  styleUrls: ['./mclr-dashboard.component.scss'],
})
export class MclrDashboardComponent implements OnInit {
  protected sixMonthChart?: GraphOptions;
  protected oneYearChart?: GraphOptions;
  private chartColors: string[] = [
    '#1C326B',
    '#528BFE',
    '#37C2CE',
    '#A7C7E7',
    '#808080',
  ];

  constructor(private apiService: ApiService) {}

  //Values for the latest mclr for the 4 blocks
  protected bestMclr = '';
  protected rbiRepoRate = '';
  protected noOfBanks = '';
  protected noOfBpBanks = '';

  protected bestMclrBank = '';
  protected bestMclrRate = '';
  protected bestonMclr = '';

  protected lastUpdated!: string;

  //Graph Values
  protected tenor6M = 'Overnight';
  protected tenor1Y = 'Overnight';
  protected selectedCompTenor = 'ON';

  // MCLR Latest Table
  protected dataSource: string[] = [];
  protected displayedColumns = [
    'bank_name',
    'frequency_type',
    'mclr_rate',
    'total_asset',
  ];

  protected pageInfo = {
    title: 'MCLR',
    content:
      "The Marginal Cost of Funds-based Lending Rates(MCLR) are sourced directly from different banks on a monthly basis. MCLR is calculated by banks in India based on specific formulas and guidelines provided by the Reserve Bank of India (RBI). Banks review their MCLR periodically, typically on a monthly or quarterly basis, to incorporate changes in their funding costs and other relevant factors. The MCLR can be revised based on the bank's assessment of its cost structure, interest rate movements, and other economic factors.",
  };

  ngOnInit(): void {
    this.setChart();
    this.getDashboardInfo();
    this.getMclrChartInfo('ON', '6M');
    this.getMclrChartInfo('ON', '1Y');
  }

  protected getDashboardInfo() {
    this.apiService
      .postRequestLegacy(FeatureList.mclr, 'mclrDashboard')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          const dashboardData = data.data;
          this.rbiRepoRate = dashboardData['reporate'];
          this.noOfBanks = dashboardData['totalBanks'];
          this.noOfBpBanks = dashboardData['bpBanks'];

          this.lastUpdated = dashboardData['effectiveMCLR'];
          this.bestMclrBank = dashboardData['tenorwisebestbank'][0]['name'];
          this.bestMclrRate =
            dashboardData['tenorwisebestbank'][0]['mclr_rate'];

          this.dataSource = dashboardData['tenorwisebestbank'];
          this.bestonMclr = dashboardData['tenorwisebestbank'][0]['mclr_rate'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getMclrChartInfo(tenor: string, interval: string) {
    const payload = {
      tenor: tenor,
      interval: interval,
    };
    this.selectedCompTenor = tenor;
    const dataset = new Array<any>();
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getTop5BanksComparision',
        payload
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          data.data.dataseries.forEach((value: any, index: number) => {
            dataset.push({
              label: value['name'],
              data: value['data'],
              backgroundColor: this.chartColors[index],
              borderColor: this.chartColors[index],
              borderWidth: 2,
              fill: 'true',
            });
          });
          if (interval === '6M') {
            if (this.sixMonthChart) {
              this.sixMonthChart.datasets = dataset;
              this.sixMonthChart.labels = data.data.months;
              this.sixMonthChart = Object.create(this.sixMonthChart);
            }
            this.tenor6M = this.tenorValueToString(tenor);
            const tenorIndex = this.getTenorIndex(tenor);
            const tempdata = JSON.parse(
              JSON.stringify(this.dataSource[tenorIndex])
            );
            this.bestMclrBank = tempdata['name'];
            this.bestMclrRate = tempdata['mclr_rate'];
          } else {
            if (this.oneYearChart) {
              this.oneYearChart.datasets = dataset;
              this.oneYearChart.labels = data.data.months;
              this.oneYearChart = Object.create(this.oneYearChart);
            }
            this.tenor1Y = this.tenorValueToString(tenor);
          }
        },
        error: (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 404) {
            alert('No Data Found!');
          } else {
            alert(err.message);
          }
        },
      });
  }

  private setChart() {
    this.sixMonthChart = {
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
      legend: 'bottom',
    };
    this.oneYearChart = {
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
      legend: 'bottom',
    };
  }

  private tenorValueToString(tenor: string) {
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

  private getTenorIndex(tenor: string) {
    switch (tenor) {
      case 'ON':
        return 0;
      case '1M':
        return 1;
      case '3M':
        return 2;
      case '6M':
        return 3;
      case '1Y':
        return 4;
      case '2Y':
        return 5;
      case '3Y':
        return 6;
      case '5Y':
        return 7;
      default:
        return -1;
    }
  }
}
