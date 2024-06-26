import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { FeatureList } from 'src/features';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { Chart } from 'chart.js/auto';

interface ChartData {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  barPercentage: number;
}
interface GraphData {
  datapoints: string[];
}

interface GraphDataObject {
  labels?: string[];
  banks?: { [key: string]: GraphData };
}

interface BankDatum {
  bank_code?: string;
  avg_max_value?: string;
}

@Component({
  selector: 'app-fd-summary',
  templateUrl: './fd-summary.component.html',
  styleUrls: ['./fd-summary.component.scss'],
})
export class FdSummaryComponent implements OnInit {
  @ViewChild('chart3M') ThreeMChartRef!: ElementRef;
  @ViewChild('chart6M') SixMChartRef!: ElementRef;

  protected charts: Chart[] = [];
  protected chart6M?: Chart;
  protected chart3M?: Chart;
  protected Object = Object;
  protected clickedTenorStates: { [key: string]: boolean } = {};
  protected amtButtonTracker: { [key: string]: boolean } = {
    '0-2': false,
    '2-5': false,
    '5-10': false,
    '10-Above': false,
  };

  protected pageInfo = {
    title: 'FD Rates',
    content:
      'A fixed deposit or an FD is an investment instrument that banks and non-banking financial companies (NBFC) offer their customers. Through an FD, people invest a certain sum of money for a fixed period at a predetermined rate of interest in an FD. The rate of interest varies from one financial institution to another, although it is usually higher than the interest offered on savings accounts. Fixed deposits are available for different periods, ranging from very short-term tenures of 7-14 days to long tenures of 10 years. A fixed deposit is sometimes known as a term deposit.',
  };
  private chartColors: string[] = [
    '#1C326B',
    '#528BFE',
    '#37C2CE',
    '#A7C7E7',
    '#808080',
    '#4CAF50',
  ];
  protected amtId = '';

  protected amt_range: { [key: string]: string } = {
    '0-2': '0 Crore - 2 Crores',
    '2-5': '2 Crores - 5 Crores',
    '5-10': '5 Crores - 10 Crores',
    '10-Above': '10 Crores - 1000 Crores',
  };

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns = ['bank_code', 'std_tenor_desc', 'max_value'];
  shortestTenorRate: string = '';
  rbiRepoRate: string = '';

  constructor(
    private apiService: ApiService, // private datePipe: DatePipe, // private exportService: ExportService
    private cdr: ChangeDetectorRef,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLatestDate();
    this.getRbiRate();
    this.getFdRateBankDets();
    this.getFdRatesTenors();
  }

  protected sixMChartId = '6MChart';
  protected threeMChartId = '3MChart';
  protected amtMemory = '';
  protected tenorMemory = '';
  protected graphMemory: { tenor: string; amt: string } = {
    tenor: '',
    amt: '',
  };

  protected generateGraphs(
    element: {
      bank_code: string;
      std_tenor_desc: string;
      max_value: string;
    },
    amt: string
  ) {
    if (
      this.graphMemory.tenor == element.std_tenor_desc &&
      this.graphMemory.amt == amt
    ) {
      return;
    }
    this.graphBank = element.bank_code;
    this.graphRate = element.max_value;
    this.graphMemory.tenor = element.std_tenor_desc;
    this.graphMemory.amt = amt;

    this.clickedTenorStates[this.tenorMemory] = false;
    this.clickedTenorStates[element.std_tenor_desc] = true;

    this.tenorMemory = element.std_tenor_desc;

    this.getGraphData(element.std_tenor_desc, this.amtMemory);
  }

  protected bankMap: { [key: string]: string } = {};

  protected getFdRateBankDets() {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRateBankDets')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          data.data.forEach((ele: { bank_name: string; bank_code: string }) => {
            this.bankMap[ele.bank_code] = ele.bank_name;
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected getGraphData(tenor: string, amt_range: string) {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRatesGraphV4', [
        amt_range,
        tenor,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.graphInfo = data['data'];
          this.generateAllGraphs(this.graphInfo);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected graphInfo: GraphDataObject = {};

  protected months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  //function to sort dates in format Month YY
  protected customDateSort = (a: string, b: string): number => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');

    // Compare years first
    if (parseInt(yearA) < parseInt(yearB)) {
      return -1;
    }
    if (parseInt(yearA) > parseInt(yearB)) {
      return 1;
    }

    // If years are the same, compare months
    const monthIndexA = this.months.indexOf(monthA);
    const monthIndexB = this.months.indexOf(monthB);

    return monthIndexA - monthIndexB;
  };
  protected data3m: any;
  protected data6m: any;

  protected generateAllGraphs(graphInfo: GraphDataObject) {
    let datalabels3m: String[] = [];
    let datalabels6m: String[] = [];
    let dataset3m: ChartData[] = [];
    let dataset6m: ChartData[] = [];

    datalabels3m = graphInfo.labels!.slice(-3);
    datalabels6m = graphInfo.labels!.slice(-6);

    const banks = Object.keys(graphInfo.banks!);
    banks.forEach((bank, index) => {
      const values = graphInfo.banks![bank].datapoints.map((val) =>
        parseFloat(val)
      );

      const values3m = values.slice(-3);
      let allZero = values3m.every((value) => value === 0);
      if (allZero) {
        return;
      }
      const values6m = values.slice(-6);

      dataset3m.push({
        label: bank,
        data: values3m,
        backgroundColor: this.chartColors[index],
        borderColor: this.chartColors[index],
        borderWidth: 2,
        borderRadius: 12,
        barPercentage: 0.8,
      });

      dataset6m.push({
        label: bank,
        data: values6m,
        backgroundColor: this.chartColors[index],
        borderColor: this.chartColors[index],
        borderWidth: 2,
        borderRadius: 12,
        barPercentage: 0.8,
      });
    });
    //this is where the chart data object is created
    this.data3m = { labels: datalabels3m, datasets: dataset3m };
    this.data6m = { labels: datalabels6m, datasets: dataset6m };
    console.log(this.data3m, this.data6m);
  }

  protected latestDate = '';
  protected getLatestDate() {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getLatestDate')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          // console.log(data['data']);
          this.latestDate = data.data[0]['max_date'];
        },

        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected getFdRatesTenors() {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRatesTenors')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          const clickedTenorStates: { common_tenor: string }[] = data['data'];
          clickedTenorStates.forEach((ele) => {
            this.clickedTenorStates[ele.common_tenor] = false;
          });
          this.getFdSummaryInfo('0-2');
          // this.getGraphData('7 days to 14 days', '0-2');
        },

        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected graphBank = '';
  protected graphRate = '';

  protected getRbiRate() {
    this.apiService
      .postRequestLegacy(FeatureList.mclr, 'mclrDashboard')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          const dashboardData = data.data;
          console.log(dashboardData);
          this.rbiRepoRate = dashboardData['reporate'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getFdSummaryInfo(text: string) {
    this.amtId = text;
    if (text == this.amtMemory) {
      return;
    }

    this.amtMemory = text;
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRatesSummaryV3', [text])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dataSource = data['data'];
          data['data'].forEach(
            (element: {
              bank_code: string;
              std_tenor_desc: string;
              max_value: string;
            }) => {
              // console.log(element);
              if (element['std_tenor_desc'] == '7 days to 14 days') {
                this.shortestTenorRate = element.max_value;
                this.generateGraphs(element, this.amtMemory);
                // console.log('summary called');
              }
            }
          );
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
