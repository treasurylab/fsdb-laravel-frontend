import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-mclr-rate-view',
  templateUrl: './mclr-rate-view.component.html',
  styleUrls: ['./mclr-rate-view.component.scss'],
})
export class MclrRateViewComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected bankList = new Array<any>();
  protected rateList = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  protected displayedColumns: string[] = [
    'compname',
    'bankname',
    'tenors',
    'rate',
    'effective_date',
  ];

  protected exportIcon = faCloudArrowDown;

  constructor(
    private apiService: ApiService,
    private exportService: ExportService
  ) {}

  public getRateList(mclrRateData: any) {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getRateList',
        mclrRateData
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.rateList.data = data.data['data'];
          this.dataSource = this.rateList;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv(rateList: any, filename: any) {
    const headerMapping: { [key: string]: string } = {
      ref: 'Reference ID',
      effective_date: 'Effective Date',
      rate: 'Rate',
      bank_name: 'Bank Name',
      comp_code: 'Company Code',
      bank_code: 'Bank Code',
      tenor: 'Tenor',
    };

    // Create a new array with customized headers
    const customizedRatelist = rateList.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (key === 'url_mclr_update' || key === 'url' || key === 'file_name') {
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
    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
