import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { ICurrentRate } from '../models/current-rate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRateRecord } from '../models/rate-record';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import { faCloudArrowDown, faLink } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';

Chart.register(...registerables);

@Component({
  selector: 'app-fx-dashboard',
  templateUrl: './fx-dashboard.component.html',
  styleUrls: ['./fx-dashboard.component.scss'],
})
export class FxDashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected dataSource = new MatTableDataSource<IRateRecord>();
  protected srcUrl = 'https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx';
  protected currentData?: ICurrentRate;

  protected selectedCurrency: 'USD' | 'GBP' | 'EURO' | 'YEN' = 'USD';
  protected displayedColumns = ['date', 'rate'];
  protected buttonNameList = ['3M', '6M', '1Y', '3Y', '5Y'];

  protected currentChart!: any;
  protected graphData: IRateRecord[] = [];
  protected selectedPeriod = '6m';
  protected linkIcon = faLink;
  protected pageInfo = {
    title: 'FX Rates',
    content:
      'Reference Rates published by RBI at 1.30 pm on a daily basis against the Rupee.',
  };
  protected exportIcon = faCloudArrowDown;

  private readonly dateFormatter = (
    tickValue: string | number,
    _: number,
    __: any[]
  ): string => {
    const date = new Date(tickValue);
    return `${date.toLocaleString('default', { month: 'short' })}'${date
      .getFullYear()
      .toString()
      .slice(-2)}`;
  };

  protected queryForm!: FormGroup;

  public constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const date: string | Date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    this.queryForm = this.formBuilder.group({
      selectedOption: ['A', Validators.required],
      fromdate: [formattedDate, Validators.required],
      todate: [''],
    });

    this.queryForm.get('selectedOption')?.valueChanges.subscribe((value) => {
      if (value === 'A') {
        this.queryForm.get('todate')?.clearValidators();
      } else {
        this.queryForm.get('todate')?.setValidators(Validators.required);
      }
      this.queryForm.get('fromdate')?.reset();
      this.queryForm.get('todate')?.reset();
      this.queryForm.get('fromdate')?.updateValueAndValidity();
      this.queryForm.get('todate')?.updateValueAndValidity();
    });

    this.getCurrentData();
    this.getTopData(this.selectedCurrency);
    this.getAllData(this.selectedCurrency);
  }

  protected switchCurrency(currencyCode: 'USD' | 'GBP' | 'EURO' | 'YEN'): void {
    if (this.selectedCurrency === currencyCode) {
      return;
    }
    this.selectedCurrency = currencyCode;
    this.getTopData(this.selectedCurrency);
    this.getAllData(this.selectedCurrency);
  }

  private getCurrentData(): void {
    this.apiService
      .getRequest('fx/latest-rate')
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.currentData = response.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getTopData(currency: string): void {
    this.apiService
      .getRequest(`fx/top-rates/${currency.toLowerCase()}`)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  private getAllData(currency: string): void {
    this.apiService
      .getRequest(`fx/currency-rates/${currency.toLowerCase()}`)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.graphData = response.data;

          const dateColumns = this.graphData
            .map((val) => val.record_date)
            .reverse();
          const dataValues = this.graphData.map((val) => val.value).reverse();

          this.selectedPeriod = '6m';
          this.initChart(dateColumns, dataValues);
          this.updateChart(this.selectedPeriod);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  protected getTableData(): void {
    if (!this.queryForm.valid) {
      alert('Please enter all parameters');
      return;
    }

    const requestPayload = this.isSingleDateSelected()
      ? {
          currency: this.selectedCurrency,
          selectedOption: 'A',
          fromdate: this.queryForm.get('fromdate')?.value,
        }
      : {
          currency: this.selectedCurrency,
          selectedOption: 'B',
          fromdate: this.queryForm.get('fromdate')?.value,
          todate: this.queryForm.get('todate')?.value,
        };

    this.apiService
      .postRequest('fx/currency-rates', requestPayload)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(): void {
    const headerMapping: { [key: string]: string } = {
      record_date: 'Date',
      value: `${this.selectedCurrency} Rate`,
    };
    const customizedRatelist = this.dataSource.data.map((row: any) => {
      const newRow: { [key: string]: any } = {};
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(headerMapping, key)) {
          newRow[headerMapping[key]] = row[key];
        } else {
          newRow[key] = row[key];
        }
      }
      return newRow;
    });
    const filename = `${this.selectedCurrency}_${new Date().toISOString()}`;
    this.exportService.downloadFile(customizedRatelist, filename);
  }

  protected isSingleDateSelected(): boolean {
    return this.queryForm.get('selectedOption')?.value === 'A';
  }

  protected isDateRangeSelected(): boolean {
    return this.queryForm.get('selectedOption')?.value === 'B';
  }

  protected updateChart(period: string): void {
    this.selectedPeriod = period.toLowerCase();
    const startDate = new Date();
    switch (this.selectedPeriod) {
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '3y':
        startDate.setFullYear(startDate.getFullYear() - 3);
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const filteredData = this.graphData.filter((entry) => {
      const entryDate = new Date(entry.record_date);
      return entryDate >= startDate;
    });

    const labels = filteredData.map((entry) => entry.record_date);
    const data = filteredData.map((entry) => Number(entry.value));

    this.initChart(labels, data);
    this.currentChart.update();
  }

  private calculateYAxisRange(data: number[]): { min: number; max: number } {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const padding = 1;

    return {
      min: minValue - padding,
      max: maxValue + padding,
    };
  }

  private initChart(labels: string[], data: number[]): void {
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Canvas context is null');
      return;
    }

    const yAxisRange = this.calculateYAxisRange(data);

    let gradient;
    let trendColor: string = '#000000';

    if (data[0] <= data[data.length - 1]) {
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0.5, '#a6dcbb');
      gradient.addColorStop(1, '#FFFFFF');
      trendColor = '#27b460';
    } else {
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0.5, '#eeb7be');
      gradient.addColorStop(1, '#FFFFFF');
      trendColor = '#d83146';
    }

    const getMonthAbbreviation = (month: number) => {
      const monthsAbbreviation = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return monthsAbbreviation[month];
    };

    const toolTipTitleCallback = (tooltipItems: any) => {
      const index = tooltipItems[0].dataIndex;
      const dateObj = new Date(labels[index]);
      const formattedDate = `${dateObj.getDate()}-${getMonthAbbreviation(
        dateObj.getMonth()
      )}-${dateObj.getFullYear().toString().slice(-2)}`;

      return `${this.selectedCurrency}: ${data[index]} | Date: ${formattedDate}`;
    };

    const gradientPlugin = {
      id: 'lines',
      afterDraw: (chart: any) => {
        const {
          ctx,
          tooltip,
          scales: { x },
        } = chart;

        // if (tooltip.active[0]) {
        //   const cursorWidth = 2;
        //   const cursorPosition = tooltip.active[0].element.x;
        if (
          tooltip &&
          tooltip.active &&
          tooltip.active.length > 0 &&
          tooltip.active[0]
        ) {
          const cursorWidth = 2;
          const cursorPosition = tooltip.active[0].element.x;

          ctx.save();
          ctx.strokeStyle = 'gray';
          ctx.lineWidth = cursorWidth;
          ctx.setLineDash([2, 2]);

          ctx.beginPath();
          ctx.moveTo(cursorPosition, 0);
          ctx.lineTo(cursorPosition, chart.chartArea.bottom);
          ctx.stroke();
          ctx.restore();
        }
      },
    };

    this.currentChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            fill: true,
            backgroundColor: gradient,
            borderColor: trendColor,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              title: toolTipTitleCallback,
              label: () => '',
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: "MMM'YY",
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: 'bold',
              },
              color: 'black',
              callback: this.dateFormatter,
            },
          },
          y: {
            min: yAxisRange.min,
            max: yAxisRange.max,
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: 'bold',
              },
              color: 'black',
            },
          },
        },
      },
      plugins: [gradientPlugin],
    });
  }

  protected resetForm(): void {
    this.queryForm.reset();
    this.queryForm.patchValue({ dateType: 'A' });
  }
}
