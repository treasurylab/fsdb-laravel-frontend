import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-fd-calculator',
  templateUrl: './fd-calculator.component.html',
  styleUrl: './fd-calculator.component.scss',
})
export class FdCalculatorComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  protected pay_freq = '';
  protected isSelected: boolean = false;
  protected sv: number = 5000;
  protected roi: number = 15;
  protected dur: number = 15;
  protected int: number = 1;
  protected amt: number = 1;
  chart: any;
  protected calcFormData = new FormGroup({
    amount: new FormControl(null, [Validators.required]),
    tenor: new FormControl(null, [Validators.required]),
    comp_fee: new FormControl('', [Validators.required]),
    int_rate: new FormControl(null, [Validators.required]),
    bank_name: new FormControl('', [Validators.required]),
    st_date: new FormControl('', [Validators.required]),
    result: new FormControl('', [Validators.required]),
    paymentType: new FormControl('', [Validators.required]),
    payout: new FormControl('', [Validators.required]),
    intType: new FormControl('', [Validators.required]),
    sliderValue: new FormControl(5000, [Validators.required]),
  });

  ngOnInit() {
    this.getTableData();
    this.getLatestDate();

    this.calculate();
    this.createPieChart();
  }

  protected calculate() {
    if (this.roi >= 20) {
      this.roi = 20;
    }

    const rate: number = this.roi / 400;
    const dura: number = this.dur * 4;
    // console.log(rate);
    // console.log(dura);
    const exp: number = Math.pow(1 + rate, dura);
    // console.log(exp);
    // this.amt = this.sv * Math.pow(1 + rate, this.dur);
    this.amt = this.sv * exp;
    this.int = this.amt - this.sv;
    this.createPieChart();
  }
  protected filterIcon = faFilter;
  protected clearIcon = faEraser;
  protected searchIcon = faMagnifyingGlass;
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected latestDate = '';

  //function to get the date upto which the data is updated
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
  //details about table data
  protected pageInfo = {
    title: 'FD Rates Description',
    content:
      'The table displays the latest rates for an amount range of 0 Crores to 2 Crores invested over 7 days to 14 days',
  };

  protected getTableData() {
    this.apiService
      .postRequestLegacy(FeatureList.fdrates, 'getFdRatesforEachBank')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data['data']);
          this.dataSource = data['data'];
        },

        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected calculateAmount() {
    if (this.calcFormData.get('paymentType')?.value === '') {
      alert('Please select Payout option');
      return;
    }
    const paymentType = this.calcFormData.get('paymentType')?.value;
    switch (paymentType) {
      case 'monthly':
        this.pay_freq = '12';
        break;
      case 'quarterly':
        this.pay_freq = '4';
        break;
      case 'halfyearly':
        this.pay_freq = '2';
        break;
      default:
        this.pay_freq = '2';
        break;
    }
    const amt = this.calcFormData.get('amount')?.value;
    const ten = this.calcFormData.get('tenor')?.value;
    const int = this.calcFormData.get('int_rate')?.value;
    const cf = this.calcFormData.get('comp_fee')?.value;
    const pay_amt = 1000;
    console.log(amt, ten, this.pay_freq, int);
    if (
      ten !== null &&
      ten !== undefined &&
      amt !== null &&
      amt !== undefined &&
      this.pay_freq !== null &&
      this.pay_freq !== undefined &&
      int !== null &&
      int !== undefined &&
      cf !== null &&
      cf !== undefined
    ) {
      var tenor = parseFloat(ten);
      const amount = parseInt(amt);
      const comp_fee = parseInt(cf);
      const int_rate = parseFloat(int) / 100;
      const pay_freq = parseInt(this.pay_freq);
      const res: string = 'NaN';
      if (this.calcFormData.get('intType')?.value === 'simpleInt') {
        console.log(this.calcFormData.get('paymentType')?.value);

        if (this.calcFormData.get('paymentType')?.value === 'reinvestment') {
          console.log('rea');

          const res = (amount + amount * int_rate * tenor)
            .toFixed(4)
            .toString();
          console.log(res);
          this.calcFormData.patchValue({
            result: res,
            payout: '',
          });
        } else {
          const res = amount + amount * int_rate * tenor;
          const pay = (amount * int_rate * tenor) / pay_freq;
          this.calcFormData.patchValue({
            result: res.toFixed(4).toString(),
            payout: pay.toFixed(4).toString(),
          });
        }
      } else if (this.calcFormData.get('intType')?.value === 'compoundInt') {
        if (this.calcFormData.get('paymentType')?.value === 'reinvestment') {
          tenor = tenor / 12;

          const res = (amount * (1 + int_rate / comp_fee) ** comp_fee * tenor)
            .toFixed(4)
            .toString();

          this.calcFormData.patchValue({
            result: res,
            payout: '',
          });
        } else {
          const compoundFactor =
            (1 + int_rate / comp_fee) ** (comp_fee * tenor);

          const futureValue = amount * compoundFactor;

          const payoutFutureValue =
            pay_amt * ((compoundFactor - 1) / (int_rate / comp_fee));

          const res = futureValue + payoutFutureValue;

          this.calcFormData.patchValue({
            result: res.toFixed(4).toString(),
          });
        }
      } else {
        alert('Please Select Interest Type');
      }
    } else {
      console.log('Invalid or missing values');
      alert('Please enter all values');
    }
  }

  isCumulative(): Boolean {
    return this.calcFormData.get('paymentType')?.value === 'reinvestment';
  }

  protected restSelected(): boolean {
    if (this.calcFormData.get('intType')?.value === 'simpleInt') {
      return true;
    } else if (this.calcFormData.get('intType')?.value === 'compoundInt') {
      return false;
    } else {
      return true;
    }
  }

  displayedColumns = ['bank_code', 'max_value'];

  protected resetForm() {
    this.calcFormData.reset();
  }

  protected dataSource: MatTableDataSource<any> = new MatTableDataSource();

  createPieChart() {
    // Get a reference to the existing chart instance
    var existingChart = Chart.getChart('pieChart');

    // Check if the existing chart exists and destroy it if so
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Total Investment', 'Total Returns'],
        datasets: [
          {
            label: '₹',
            data: [this.sv, this.int],
            backgroundColor: [
              // 'rgba(135, 206, 235, 1)',
              'rgba(209, 213, 237, 1)',
              // 'rgba(211, 211, 211, 1)',
              'rgba(63, 81, 181, 1)',
            ],
            borderColor: ['rgba(230, 230, 230, 1)', 'rgba(230, 230, 230, 1)'],
          },
        ],
      },
      options: {
        cutout: 80,
        responsive: false,
      },
    });
  }
}
