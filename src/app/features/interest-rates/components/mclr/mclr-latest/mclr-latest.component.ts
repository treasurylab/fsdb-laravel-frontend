import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  faArrowsRotate,
  faCloudArrowDown,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mclr-latest',
  templateUrl: './mclr-latest.component.html',
  styleUrls: ['./mclr-latest.component.scss'],
})
export class MclrLatestComponent implements OnInit, AfterViewInit {
  protected mclrBankData: any[] = [];
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private exportService: ExportService
  ) {}

  protected refreshIcon = faArrowsRotate;
  protected filterIcon = faFilter;
  protected exportIcon = faCloudArrowDown;

  displayedColumns: string[] = [
    'no',
    'Bank Code',
    'Bank Name',
    'Mclr AUM',
    'Overnight',
    '1 Month',
    '3 Months',
    '6 Months',
    '1 Year',
    '2 Years',
    '3 Years',
    '5 Years',
    'Effective Date',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSource = new MatTableDataSource<any>(this.mclrBankData);
  allData: any = [];

  ngOnInit(): void {
    this.mclrBankData.length = 0;
    this.getLatestTable();
  }

  getLatestTable() {
    this.apiService
      .getRequestLegacy(FeatureList.mclr, 'getMclrLatestRates')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.allData = data['data'].rates;
          var index = 1;
          this.allData.forEach((row: any) => {
            var aum: number = row['total_asset']
              ? parseFloat(row['total_asset'].replace(/,/g, ''))
              : 0; // Convert to number and remove commas
            var arrayRow = {
              no: index,
              bankCode: row['bank_code'],
              bankName: row['bank_name'],
              aum: aum,
              overnight: row['ON'],
              oneMonth: row['1M'],
              threeMonth: row['3M'],
              sixMonth: row['6M'],
              oneYear: row['1Y'],
              twoYear: row['2Y'],
              threeYear: row['3Y'],
              fiveYear: row['5Y'],
              effectiveDate: row['effective_date'],
              url: row['url'],
            };
            if (arrayRow.bankName != null) {
              this.mclrBankData.push(arrayRow);
              index++;
            }
          });
          this.dataSource.data = this.mclrBankData;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  sortAum(direction: 'asc' | 'desc'): void {
    // console.log(direction);
    // Convert aum values to numbers for proper sorting
    this.dataSource.data.forEach((item) => {
      if (typeof item.aum === 'string') {
        item.aum = parseFloat(item.aum.replace(/,/g, ''));
      }
    });

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const aValue = a.aum;
      const bValue = b.aum;

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // console.log('Sorted data:', this.dataSource.data);
    this.cdr.detectChanges();
  }

  exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      bankCode: 'Bank Code',
      bankName: 'Bank Name',
      aum: 'AUM',
      overnight: 'Overnight',
      oneMonth: '1 Month',
      threeMonth: '3 Month',
      sixMonth: '6 Month',
      oneYear: '1 Year',
      twoYear: '2 Year',
      threeYear: '3 Year',
      fiveYear: '5 Year',
      effectiveDate: 'Effective Date',
      // Add more mappings as needed
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (key === 'no' || key === 'url') {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
