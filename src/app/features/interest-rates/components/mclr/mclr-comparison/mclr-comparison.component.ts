// import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { first } from 'rxjs';
// import { ExportService } from 'src/app/core/services/export.service';
// import { Chart, registerables } from 'chart.js';
// import { ApiService } from 'src/app/shared/services/api/api.service';
// import { FeatureList } from 'src/features';
// import { GenericResponse } from 'src/app/shared/models/generic-response';
// import { MclrCompResponse } from '../../../models/mclr-comparison/mclr-comp-response';
// import { GraphOptions } from 'src/app/shared/models/graphs/graph-options';
// import {
//   faCloudArrowDown,
//   faEraser,
//   faFilter,
//   faMagnifyingGlass,
// } from '@fortawesome/free-solid-svg-icons';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-mclr-comparison',
//   templateUrl: './mclr-comparison.component.html',
//   styleUrls: ['./mclr-comparison.component.scss'],
// })
// export class MclrComparisonComponent implements OnInit {
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   dataSource = new MatTableDataSource<any>();

//   protected banks: any;
//   protected dataset: any;
//   protected category: any;
//   protected tableData: any;
//   protected chart: Chart | undefined;
//   protected chartOptions?: GraphOptions;
//   protected tableChips: string[] = [];
//   protected mclrCompForm = new FormGroup({
//     fromDate: new FormControl('', [Validators.required]),
//     toDate: new FormControl('', [Validators.required]),
//     bank_code: new FormControl(new Array<string>(), [Validators.required]),
//     tenor: new FormControl('ON'),
//   });
//   protected tabList = ['Rate List', 'Graph'];
//   protected activeTab: string = 'Rate List';
//   protected exportIcon = faCloudArrowDown;
//   protected searchIcon = faMagnifyingGlass;
//   protected clearIcon = faEraser;
//   protected filterIcon = faFilter;

//   constructor(
//     private apiService: ApiService,
//     private exportService: ExportService
//   ) {}

//   protected displayedColumns = [
//     'bank_code',
//     'bank_name',
//     'frequency_type',
//     'mclr_rate',
//     'effective_date',
//   ];

//   protected tenors = [
//     { mfreq_code: 'ON', viewValue: 'Overnight' },
//     { mfreq_code: '1M', viewValue: '1 Month' },
//     { mfreq_code: '3M', viewValue: '3 Months' },
//     { mfreq_code: '6M', viewValue: '6 Months' },
//     { mfreq_code: '1Y', viewValue: '1  Year' },
//     { mfreq_code: '2Y', viewValue: '2  Years' },
//     { mfreq_code: '3Y', viewValue: '3  Years' },
//     { mfreq_code: '5Y', viewValue: '5  Years' },
//   ];

//   ngOnInit(): void {
//     this.getAllBankList();
//     const defaultBanks: string[] = ['AUBL', 'UTIB', 'BDBL', 'BOFA', 'BBKM'];
//     let fromDate: Date | string = new Date();
//     fromDate.setMonth(fromDate.getMonth() - 3);
//     fromDate = fromDate.toISOString().split('T')[0];
//     this.mclrCompForm.get('fromDate')?.setValue(fromDate);
//     let toDate: Date | string = new Date();
//     toDate.setDate(toDate.getDate());
//     toDate = toDate.toISOString().split('T')[0];
//     this.mclrCompForm.get('toDate')?.setValue(toDate);
//     this.mclrCompForm.get('bank_code')?.setValue(defaultBanks);
//     this.searchMCLRComparision();
//   }

//   protected getFormControllers(name: string) {
//     const ctrl = this.mclrCompForm.get(name) as FormControl;
//     if (!ctrl) throw 'Missing Form Control for ' + name;
//     return ctrl;
//   }

//   protected isBankDisabled(bankCode: string): boolean {
//     const bankCodeControl = this.mclrCompForm.get('bank_code');
//     if (bankCodeControl && bankCodeControl.value) {
//       const selectedBankCodes = bankCodeControl.value.map(
//         (selectedBank: any) => selectedBank
//       );
//       return (
//         selectedBankCodes.length > 4 && !selectedBankCodes.includes(bankCode)
//       );
//     }

//     return false;
//   }

//   protected compareBanks(bank1: any, bank2: any): boolean {
//     return bank1 && bank2
//       ? bank1.bank_code === bank2.bank_code
//       : bank1 === bank2;
//   }

//   private getAllBankList() {
//     this.apiService
//       .getRequest(FeatureList.mclr, 'getAllMclrBankList')
//       .pipe(first())
//       .subscribe({
//         next: (data: any) => {
//           this.banks = data['data'];
//         },
//         error: (err) => {
//           console.log(err);
//         },
//       });
//   }

//   protected searchMCLRComparision() {
//     if (this.mclrCompForm.valid) {
//       const requestPayload = {
//         bank_code: this.mclrCompForm.get('bank_code')?.value,
//         from_date: this.mclrCompForm.get('fromDate')?.value,
//         to_date: this.mclrCompForm.get('toDate')?.value,
//         tenor: this.mclrCompForm.get('tenor')?.value,
//       };

//       this.tableChips = [];

//       const labelMapping: { [key: string]: string } = {
//         fromDate: 'From Date',
//         toDate: 'To Date',
//         bank_code: 'Bank',
//         tenor: 'Tenor',
//       };
//       // Extract form values and push to tableChips
//       for (const key in this.mclrCompForm.controls) {
//         const control = this.mclrCompForm.get(key);
//         if (control && control.value) {
//           const label = labelMapping[key] || key;
//           this.tableChips.push(`${label}: ${control.value}`);
//         }
//       }
//       this.apiService
//         .postRequest<GenericResponse<MclrCompResponse>>(
//           FeatureList.mclr,
//           'getRatesComparision',
//           requestPayload
//         )
//         .pipe(first())
//         .subscribe({
//           next: (data) => {
//             this.tableData = data['data'].data;
//             this.dataSource.data = this.tableData;
//             this.dataSource.paginator = this.paginator;
//             this.dataset = data['data'].dataset;
//             if (this.activeTab === this.tabList[1]) {
//               this.initializeChart();
//             }
//           },
//           error: (error) => {
//             alert('Error fetching data:' + error);
//           },
//         });
//     }
//   }

//   protected onTabChange(event: string): void {
//     this.activeTab = event;
//     if (event === this.tabList[1]) {
//       this.initializeChart();
//     }
//   }

//   private initializeChart() {
//     const months = this.dataset.reduce((acc: any[], data: any) => {
//       data.data.forEach((item: any) => {
//         const month = item.month;
//         if (!acc.includes(month)) {
//           acc.push(month);
//         }
//       });
//       return acc;
//     }, []);
//     months.sort((a: string, b: string) => {
//       const dateA = new Date(a);
//       const dateB = new Date(b);
//       return dateA.getTime() - dateB.getTime();
//     });
//     const colors = ['#1C326B', '#528BFE', '#37C2CE', '#A7C7E7', '#808080'];
//     const chartLabels = months;
//     const chartDataset = this.dataset.map((data: any, index: number) => {
//       const bankData = data.data.reduce((acc: any, item: any) => {
//         acc[item.month] = item.mclr_rate;
//         return acc;
//       }, {});
//       const chartData = months.map((month: string) => {
//         return bankData[month] || 0;
//       });
//       return {
//         label: data.name,
//         data: chartData,
//         borderColor: colors[index % colors.length],
//         backgroundColor: 'rgba(0, 0, 0, 0)',
//         borderWidth: 2,
//         fill: false,
//       };
//     });
//     const xScale = {
//       title: {
//         display: true,
//         text: 'Months',
//         font: {
//           weight: 'bold',
//         },
//       },
//       grid: {
//         display: true,
//         color: 'rgba(0, 0, 0, 0.1)',
//       },
//     };
//     const yScale = {
//       beginAtZero: true,
//       title: {
//         display: true,
//         text: 'MCLR Rate',
//         font: {
//           weight: 'bold',
//         },
//       },
//       grid: {
//         display: true,
//         color: 'rgba(0, 0, 0, 0.1)',
//       },
//     };
//     this.chartOptions = {
//       labels: chartLabels,
//       datasets: chartDataset,
//       legend: 'bottom',
//       xScale: xScale,
//       yScale: yScale,
//     };
//   }

//   protected exportToCsv(ratelist: any, filename: any) {
//     // Create a mapping of old header names to new header names
//     const headerMapping: { [key: string]: string } = {
//       bank_code: 'Bank Code',
//       bank_name: 'Bank Name',
//       frequency_type: 'Tenor',
//       mclr_rate: 'Rate',
//       effective_date: 'Effective Date',
//     };

//     // Create a new array with customized headers
//     const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
//       const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
//       for (const key in row) {
//         if (key === 'url_mclr_update' || key === 'mfreq_code') {
//           continue; // Skip these columns
//         }
//         if (headerMapping.hasOwnProperty(key)) {
//           newRow[headerMapping[key]] = row[key];
//         } else {
//           newRow[key] = row[key];
//         }
//       }
//       return newRow;
//     });

//     // Download the CSV file
//     this.exportService.downloadFile(customizedRatelist, filename);
//   }
// }

// --------------------------

import { DatePipe } from '@angular/common'; // Import DatePipe
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { MclrCompResponse } from '../../../models/mclr-comparison/mclr-comp-response';
import { GraphOptions } from 'src/app/shared/models/graphs/graph-options';
import {
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mclr-comparison',
  templateUrl: './mclr-comparison.component.html',
  styleUrls: ['./mclr-comparison.component.scss'],
  providers: [DatePipe], // Provide DatePipe
})
export class MclrComparisonComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();

  protected banks: any;
  protected dataset: any;
  protected category: any;
  protected tableData: any;
  protected chart: Chart | undefined;
  protected chartOptions?: GraphOptions;
  protected tableChips: string[] = [];
  protected mclrCompForm = new FormGroup({
    fromDate: new FormControl('', [Validators.required]),
    toDate: new FormControl('', [Validators.required]),
    bank_code: new FormControl(new Array<string>(), [Validators.required]),
    tenor: new FormControl('ON'),
  });
  protected tabList = ['Rate List', 'Graph'];
  protected activeTab: string = 'Rate List';
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  protected displayedColumns = [
    'bank_code',
    'bank_name',
    'frequency_type',
    'mclr_rate',
    'effective_date',
  ];

  protected tenors = [
    { mfreq_code: 'ON', viewValue: 'Overnight' },
    { mfreq_code: '1M', viewValue: '1 Month' },
    { mfreq_code: '3M', viewValue: '3 Months' },
    { mfreq_code: '6M', viewValue: '6 Months' },
    { mfreq_code: '1Y', viewValue: '1 Year' },
    { mfreq_code: '2Y', viewValue: '2 Years' },
    { mfreq_code: '3Y', viewValue: '3 Years' },
    { mfreq_code: '5Y', viewValue: '5 Years' },
  ];

  ngOnInit(): void {
    this.getAllBankList();
    const defaultBanks: string[] = ['AUBL', 'UTIB', 'BDBL', 'BOFA', 'BBKM'];
    let fromDate: Date | string = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3);
    fromDate = fromDate.toISOString().split('T')[0];
    this.mclrCompForm.get('fromDate')?.setValue(fromDate);
    let toDate: Date | string = new Date();
    toDate.setDate(toDate.getDate());
    toDate = toDate.toISOString().split('T')[0];
    this.mclrCompForm.get('toDate')?.setValue(toDate);
    this.mclrCompForm.get('bank_code')?.setValue(defaultBanks);
    this.searchMCLRComparision();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.mclrCompForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected isBankDisabled(bankCode: string): boolean {
    const bankCodeControl = this.mclrCompForm.get('bank_code');
    if (bankCodeControl && bankCodeControl.value) {
      const selectedBankCodes = bankCodeControl.value.map(
        (selectedBank: any) => selectedBank
      );
      return (
        selectedBankCodes.length > 4 && !selectedBankCodes.includes(bankCode)
      );
    }

    return false;
  }

  protected compareBanks(bank1: any, bank2: any): boolean {
    return bank1 && bank2
      ? bank1.bank_code === bank2.bank_code
      : bank1 === bank2;
  }

  private getAllBankList() {
    this.apiService
      .getRequestLegacy(FeatureList.mclr, 'getAllMclrBankList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.banks = data['data'];
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  protected searchMCLRComparision() {
    if (this.mclrCompForm.valid) {
      const requestPayload = {
        bank_code: this.mclrCompForm.get('bank_code')?.value,
        from_date: this.mclrCompForm.get('fromDate')?.value,
        to_date: this.mclrCompForm.get('toDate')?.value,
        tenor: this.mclrCompForm.get('tenor')?.value,
      };

      this.tableChips = [];

      const labelMapping: { [key: string]: string } = {
        fromDate: 'From Date',
        toDate: 'To Date',
        bank_code: 'Bank',
        tenor: 'Tenor',
      };

      const tenorMapping: { [key: string]: string } = this.tenors.reduce(
        (acc, tenor) => {
          acc[tenor.mfreq_code] = tenor.viewValue;
          return acc;
        },
        {} as { [key: string]: string }
      );

      // Extract form values and push to tableChips
      for (const key in this.mclrCompForm.controls) {
        const control = this.mclrCompForm.get(key);
        if (control && control.value) {
          let value = control.value;
          if (key === 'fromDate' || key === 'toDate') {
            value = this.datePipe.transform(value, 'dd.MM.yyyy');
          } else if (key === 'tenor') {
            value = tenorMapping[value] || value;
          }
          const label = labelMapping[key] || key;
          this.tableChips.push(`${label}: ${value}`);
        }
      }

      this.apiService
        .postRequestLegacy<GenericResponse<MclrCompResponse>>(
          FeatureList.mclr,
          'getRatesComparision',
          requestPayload
        )
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.tableData = data['data'].data;
            this.dataSource.data = this.tableData;
            this.dataSource.paginator = this.paginator;
            this.dataset = data['data'].dataset;
            if (this.activeTab === this.tabList[1]) {
              this.initializeChart();
            }
          },
          error: (error) => {
            alert('Error fetching data:' + error);
          },
        });
    }
  }

  protected onTabChange(event: string): void {
    this.activeTab = event;
    if (event === this.tabList[1]) {
      this.initializeChart();
    }
  }

  private initializeChart() {
    const months = this.dataset.reduce((acc: any[], data: any) => {
      data.data.forEach((item: any) => {
        const month = item.month;
        if (!acc.includes(month)) {
          acc.push(month);
        }
      });
      return acc;
    }, []);
    months.sort((a: string, b: string) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
    const colors = ['#1C326B', '#528BFE', '#37C2CE', '#A7C7E7', '#808080'];
    const chartLabels = months;
    const chartDataset = this.dataset.map((data: any, index: number) => {
      const bankData = data.data.reduce((acc: any, item: any) => {
        acc[item.month] = item.mclr_rate;
        return acc;
      }, {});
      const chartData = months.map((month: string) => {
        return bankData[month] || 0;
      });
      return {
        label: data.name,
        data: chartData,
        borderColor: colors[index % colors.length],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 2,
        fill: false,
      };
    });
    const xScale = {
      title: {
        display: true,
        text: 'Months',
        font: {
          weight: 'bold',
        },
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    };
    const yScale = {
      beginAtZero: true,
      title: {
        display: true,
        text: 'MCLR Rate',
        font: {
          weight: 'bold',
        },
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    };
    this.chartOptions = {
      labels: chartLabels,
      datasets: chartDataset,
      legend: 'bottom',
      xScale: xScale,
      yScale: yScale,
    };
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      bank_code: 'Bank Code',
      bank_name: 'Bank Name',
      frequency_type: 'Tenor',
      mclr_rate: 'Rate',
      effective_date: 'Effective Date',
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (key === 'url_mclr_update' || key === 'mfreq_code') {
          continue; // Skip these columns
        }
        if (headerMapping.hasOwnProperty(key)) {
          newRow[headerMapping[key]] = row[key];
        } else {
          newRow[key] = row[key];
        }
      }
      return newRow;
    });

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
