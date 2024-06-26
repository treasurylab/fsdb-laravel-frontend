import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-mclr-rate-download-view',
  templateUrl: './mclr-rate-download-view.component.html',
  styleUrls: ['./mclr-rate-download-view.component.scss'],
})
export class MclrRateDownloadViewComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected displayedColumns: string[] = [
    'srno',
    'bankname',
    'rate',
    'refno',
    'effectivedate',
  ];
  protected rateList = new MatTableDataSource<any>();
  protected exportIcon = faCloudArrowDown;
  dataSource = new MatTableDataSource<any>();

  constructor(
    private apiService: ApiService,
    private exportService: ExportService
  ) {}

  public downloadMclrRates(formdata: any) {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getAllMclrRate',
        formdata
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data.code === 200) {
            this.rateList.data = data.data;
            this.dataSource = this.rateList;
            this.dataSource.paginator = this.paginator;
          } else {
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportToCsv() {
    const headerMapping: { [key: string]: string } = {
      ref: 'Reference ID',
      effective_date: 'Effective Date',
      rate: 'Rate',
      bank_name: 'Bank Name',
      comp_code: 'Company Code',
      bank_code: 'Bank Code',
      tenor: 'Tenor',
    };
    const customizedRatelist = this.rateList.data.map(
      (row: { [key: string]: any }) => {
        const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
        for (const key in row) {
          if (
            key === 'url_mclr_update' ||
            key === 'url' ||
            key === 'file_name'
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
      }
    );
    this.exportService.downloadFile(customizedRatelist, 'MclrRates');
  }
}
