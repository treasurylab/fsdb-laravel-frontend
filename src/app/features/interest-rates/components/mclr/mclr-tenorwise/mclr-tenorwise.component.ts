// import { DatePipe } from '@angular/common';
// import {
//   AfterViewInit,
//   ChangeDetectorRef,
//   Component,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import { FormGroup, FormControl } from '@angular/forms';
// import { MatTableDataSource } from '@angular/material/table';
// import {
//   faArrowsRotate,
//   faCloudArrowDown,
//   faEraser,
//   faFilter,
//   faMagnifyingGlass,
// } from '@fortawesome/free-solid-svg-icons';
// import { first } from 'rxjs';
// import { ExportService } from 'src/app/core/services/export.service';
// import { ApiService } from 'src/app/shared/services/api/api.service';
// import { FeatureList } from 'src/features';
// import { MatPaginator } from '@angular/material/paginator';

// @Component({
//   selector: 'app-mclr-tenorwise',
//   templateUrl: './mclr-tenorwise.component.html',
//   styleUrls: ['./mclr-tenorwise.component.scss'],
// })
// export class MclrTenorwiseComponent implements OnInit, AfterViewInit {
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   ngAfterViewInit() {
//     this.tenorWisetRates.paginator = this.paginator;
//   }
//   protected displayedColumns: string[] = [
//     'srno',
//     'bank_code',
//     'bank_name',
//     'mclr_aum',
//     'mclr_rate',
//     'effective_date',
//   ];
//   protected tenorDateData: any = [];
//   protected tableChips: string[] = [];
//   protected tenorWisetRates: MatTableDataSource<any> = new MatTableDataSource();
//   protected exportIcon = faCloudArrowDown;
//   protected refreshIcon = faArrowsRotate;
//   protected searchIcon = faMagnifyingGlass;
//   protected clearIcon = faEraser;
//   protected filterIcon = faFilter;

//   constructor(
//     private apiService: ApiService,
//     private exportService: ExportService,
//     private cdr: ChangeDetectorRef,
//     private datePipe: DatePipe
//   ) {}

//   protected tenorWiseForm = new FormGroup({
//     mfreq_code: new FormControl('ON'),
//     keydate: new FormControl(''),
//     bestrate: new FormControl(false),
//   });

//   ngOnInit() {
//     const date: string | Date = new Date();
//     const formattedDate = date.toISOString().split('T')[0];
//     this.tenorWiseForm!.get('keydate')!.setValue(formattedDate);
//     this.getMclrTenorWiseRates();
//   }

//   protected tenors = [
//     { mfreq_code: 'ON', viewValue: 'Overnight' },
//     { mfreq_code: '1M', viewValue: '1 Month' },
//     { mfreq_code: '3M', viewValue: '3 Month' },
//     { mfreq_code: '6M', viewValue: '6 Month' },
//     { mfreq_code: '1Y', viewValue: '1 Year' },
//     { mfreq_code: '2Y', viewValue: '2 Year' },
//     { mfreq_code: '3Y', viewValue: '3 Year' },
//     { mfreq_code: '5Y', viewValue: '4 Year' },
//     { mfreq_code: '5Y', viewValue: '5 Year' },
//   ];

//   // Get banklist Tenor Wise Rates
//   protected getMclrTenorWiseRates() {
//     this.tenorDateData = this.tenorWiseForm.value;
//     const requestOptions = {
//       bestrate: this.tenorWiseForm.controls['bestrate'].value,
//       keydate: this.tenorWiseForm.controls['keydate'].value,
//       mfreq_code: this.tenorWiseForm.controls['mfreq_code'].value,
//     };
//     this.tenorDateData.mfreq_code = this.tenorDateData.mfreq_code;
//     if (!isNaN(Date.parse(this.tenorDateData.keydate))) {
//       this.tenorDateData.keydate = new Date(this.tenorDateData.keydate);
//       this.tenorDateData.keydate = this.datePipe.transform(
//         this.tenorDateData.keydate,
//         'yyyy-MM-dd'
//       );
//     }
//     this.tenorDateData.bestrate = this.tenorDateData.bestrate;

//     this.tableChips = [];

//     for (const key in this.tenorDateData) {
//       if (this.tenorDateData[key] !== '') {
//         // Exclude fhlist as it's already handled separately
//         let label = key;
//         if (key === 'mfreq_code') {
//           label = 'Tenor';
//         } else if (key === 'keydate') {
//           label = 'Key Date';
//         }

//         this.tableChips.push(`${label}: ${this.tenorDateData[key]}`);
//       }
//     }
//     this.apiService
//       .postRequest(
//         FeatureList.mclr,
//         'getMclrTenorWiseRatesList',
//         this.tenorDateData
//       )
//       .pipe(first())
//       .subscribe({
//         next: (data: any) => {
//           this.tenorWisetRates.data = data['data'];
//           this.tenorWisetRates.paginator = this.paginator;
//           this.tenorWisetRates.data.forEach((item) => {
//             if (typeof item.total_asset === 'string') {
//               item.total_asset = parseFloat(item.total_asset.replace(/,/g, ''));
//             }
//           });
//         },
//         error: (err: any) => {
//           console.log(err);
//         },
//       });
//   }

//   protected getFormControllers(name: string) {
//     const ctrl = this.tenorWiseForm.get(name) as FormControl;
//     if (!ctrl) throw 'Missing Form Control for ' + name;
//     return ctrl;
//   }

//   protected sortTotalAsset(sortType: 'asc' | 'desc'): void {
//     if (this.tenorWisetRates && this.tenorWisetRates.data) {
//       this.tenorWisetRates.data.forEach((item) => {
//         if (typeof item.total_asset === 'string') {
//           item.total_asset = parseFloat(item.total_asset.replace(/,/g, ''));
//         }
//       });
//       this.tenorWisetRates.data = this.tenorWisetRates.data.sort((a, b) => {
//         const valueA = a.total_asset;
//         const valueB = b.total_asset;
//         return sortType === 'asc' ? valueA - valueB : valueB - valueA;
//       });
//       this.cdr.detectChanges();
//     } else {
//       console.log(
//         'Data not sorted - tenorWisetRates or data is null or undefined.'
//       );
//     }
//   }

//   protected exportToCsv(ratelist: any, filename: any) {
//     // Create a mapping of old header names to new header names
//     const headerMapping: { [key: string]: string } = {
//       bank_code: 'Bank Code',
//       bank_name: 'Bank Name',
//       total_asset: 'MCLR AUM',
//       frequency_type: 'Tenor',
//       mclr_rate: 'Rate',
//       effective_date: 'Effective Date',
//     };

//     // Create a new array with customized headers
//     const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
//       const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
//       for (const key in row) {
//         if (
//           key === 'url_mclr_update' ||
//           key === 'mfreq_code' ||
//           key === 'cid' ||
//           key === 'cdt'
//         ) {
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

// ------------

import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mclr-tenorwise',
  templateUrl: './mclr-tenorwise.component.html',
  styleUrls: ['./mclr-tenorwise.component.scss'],
})
export class MclrTenorwiseComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.tenorWisetRates.paginator = this.paginator;
  }
  protected displayedColumns: string[] = [
    'srno',
    'bank_code',
    'bank_name',
    'mclr_aum',
    'mclr_rate',
    'effective_date',
  ];
  protected tenorDateData: any = [];
  protected tableChips: string[] = [];
  protected tenorWisetRates: MatTableDataSource<any> = new MatTableDataSource();
  protected exportIcon = faCloudArrowDown;
  protected refreshIcon = faArrowsRotate;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  protected tenorWiseForm = new FormGroup({
    mfreq_code: new FormControl('ON'),
    keydate: new FormControl(''),
    bestrate: new FormControl(false),
  });

  ngOnInit() {
    const date: string | Date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    this.tenorWiseForm!.get('keydate')!.setValue(formattedDate);
    this.getMclrTenorWiseRates();
  }

  protected tenors = [
    { mfreq_code: 'ON', viewValue: 'Overnight' },
    { mfreq_code: '1M', viewValue: '1 Month' },
    { mfreq_code: '3M', viewValue: '3 Month' },
    { mfreq_code: '6M', viewValue: '6 Month' },
    { mfreq_code: '1Y', viewValue: '1 Year' },
    { mfreq_code: '2Y', viewValue: '2 Year' },
    { mfreq_code: '3Y', viewValue: '3 Year' },
    { mfreq_code: '4Y', viewValue: '4 Year' },
    { mfreq_code: '5Y', viewValue: '5 Year' },
  ];

  // Get banklist Tenor Wise Rates
  protected getMclrTenorWiseRates() {
    this.tenorDateData = this.tenorWiseForm.value;
    const requestOptions = {
      bestrate: this.tenorWiseForm.controls['bestrate'].value,
      keydate: this.tenorWiseForm.controls['keydate'].value,
      mfreq_code: this.tenorWiseForm.controls['mfreq_code'].value,
    };
    this.tenorDateData.mfreq_code = this.tenorDateData.mfreq_code;
    if (!isNaN(Date.parse(this.tenorDateData.keydate))) {
      this.tenorDateData.keydate = new Date(this.tenorDateData.keydate);
      this.tenorDateData.keydate = this.datePipe.transform(
        this.tenorDateData.keydate,
        'yyyy-MM-dd'
      );
    }
    this.tenorDateData.bestrate = this.tenorDateData.bestrate;

    this.tableChips = [];

    for (const key in this.tenorDateData) {
      if (this.tenorDateData[key] !== '' && key !== 'bestrate') {
        let label = key;
        let value = this.tenorDateData[key];
        if (key === 'mfreq_code') {
          label = 'Tenor';
          const tenor = this.tenors.find((tenor) => tenor.mfreq_code === value);
          value = tenor ? tenor.viewValue : value;
        } else if (key === 'keydate') {
          label = 'Key Date';
          value = this.datePipe.transform(value, 'dd.MM.yyyy');
        }

        this.tableChips.push(`${label}: ${value}`);
      }
    }
    this.apiService
      .postRequestLegacy(
        FeatureList.mclr,
        'getMclrTenorWiseRatesList',
        this.tenorDateData
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.tenorWisetRates.data = data['data'];
          this.tenorWisetRates.paginator = this.paginator;
          this.tenorWisetRates.data.forEach((item) => {
            if (typeof item.total_asset === 'string') {
              item.total_asset = parseFloat(item.total_asset.replace(/,/g, ''));
            }
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.tenorWiseForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected sortTotalAsset(sortType: 'asc' | 'desc'): void {
    if (this.tenorWisetRates && this.tenorWisetRates.data) {
      this.tenorWisetRates.data.forEach((item) => {
        if (typeof item.total_asset === 'string') {
          item.total_asset = parseFloat(item.total_asset.replace(/,/g, ''));
        }
      });
      this.tenorWisetRates.data = this.tenorWisetRates.data.sort((a, b) => {
        const valueA = a.total_asset;
        const valueB = b.total_asset;
        return sortType === 'asc' ? valueA - valueB : valueB - valueA;
      });
      this.cdr.detectChanges();
    } else {
      console.log(
        'Data not sorted - tenorWisetRates or data is null or undefined.'
      );
    }
  }

  protected exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      bank_code: 'Bank Code',
      bank_name: 'Bank Name',
      total_asset: 'MCLR AUM',
      frequency_type: 'Tenor',
      mclr_rate: 'Rate',
      effective_date: 'Effective Date',
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (
          key === 'url_mclr_update' ||
          key === 'mfreq_code' ||
          key === 'cid' ||
          key === 'cdt'
        ) {
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
