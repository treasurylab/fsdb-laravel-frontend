import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import {
  faCloudArrowDown,
  faFilter,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-overnight-mibor',
  templateUrl: './overnight-mibor.component.html',
  styleUrls: ['./overnight-mibor.component.scss'],
})
export class OvernightMiborComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected tabList = ['Key Date', 'Range'];
  protected activeTab = 'Key Date';
  protected exportIcon = faCloudArrowDown;
  protected linkIcon = faLink;
  protected filterIcon = faFilter;
  protected pageInfo = {
    title: 'Overnight MIBOR',
    content:
      'FBIL announces the benchmark rate for Overnight Mumbai Interbank Outright Rate (MIBOR) on a daily basis, except Saturdays, Sundays and local holidays. The benchmark rate is calculated based on the actual call money transactions data obtained from the NDS-call platform of Clearing Corporation of India Ltd (CCIL). The CCIL acts as the Calculating Agent. The rate is announced at 10.45 AM every day. However, if the time is extended due to non-fulfillment of threshold criteria, the dissemination time may get suitably extended.',
  };

  protected displayedColumnDW2 = ['date', 'on'];
  protected miborrateList = new MatTableDataSource<any>();
  protected miborformdata: any = [];
  protected tableChips: string[] = [];
  protected miborrate = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    selectedOption: new FormControl('A'),
  });

  constructor(
    private apiService: ApiService,
    private exportService: ExportService,
    private datePipe: DatePipe,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const today = new Date();
    today.setDate(today.getDate());
    const formattedDate = today.toISOString().split('T')[0];
    this.miborrate!.get('fromdate')!.setValue(formattedDate);
    this.miborrate!.get('todate')!.setValue(formattedDate);
    this.tableChips = [
      `Key Date: ${this.datePipe.transform(formattedDate, 'dd.MM.yyyy')}`,
    ];
    this.getONMiborList();
  }

  private getONMiborList() {
    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getOnMiborList',
        this.miborformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateList.data = data['data'];
          this.miborrateList.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getMiborDownload() {
    this.miborformdata = this.miborrate.value;
    if (!isNaN(Date.parse(this.miborformdata.fromdate))) {
      this.miborformdata.fromdate = new Date(this.miborformdata.fromdate);
      this.miborformdata.fromdate = this.datePipe.transform(
        this.miborformdata.fromdate,
        'yyyy-MM-dd'
      );
      if (this.miborformdata.selectedOption === 'B') {
        this.miborformdata.todate = new Date(this.miborformdata.todate);
        this.miborformdata.todate = this.datePipe.transform(
          this.miborformdata.todate,
          'yyyy-MM-dd'
        );
      }

      this.tableChips = [];
      if (this.miborformdata.selectedOption === 'A') {
        this.tableChips.push(
          `Key Date: ${this.datePipe.transform(
            this.miborformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
      } else if (this.miborformdata.selectedOption === 'B') {
        this.tableChips.push(
          `From Date: ${this.datePipe.transform(
            this.miborformdata.fromdate,
            'dd.MM.yyyy'
          )} `
        );
        this.tableChips.push(
          ` To Date: ${this.datePipe.transform(
            this.miborformdata.todate,
            'dd.MM.yyyy'
          )}`
        );
      }
    } else {
      console.log('Date not valid');
    }
    this.apiService
      .postRequestLegacy(
        FeatureList.benchmark,
        'getOnMiborList',
        this.miborformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateList.data = data['data'];
          this.miborrateList.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected exportOvernightMibor() {
    const headerMapping: { [key: string]: string } = {
      record_date: 'Record Date',
      on: 'ON',
    };

    // Filter the columns to export
    const columnsToExport = ['record_date', 'on'];

    this.exportToCsv('MIBORON_RATES', headerMapping, columnsToExport);
  }

  protected exportToCsv(
    filename: any,
    headerMapping: any,
    columnsToExport: string[]
  ) {
    const customizedRatelist = this.miborrateList.data.map(
      (row: { [key: string]: any }) => {
        const newRow: { [key: string]: any } = {};
        columnsToExport.forEach((colName) => {
          if (headerMapping.hasOwnProperty(colName)) {
            newRow[headerMapping[colName]] = row[colName];
          } else {
            newRow[colName] = row[colName];
          }
        });
        return newRow;
      }
    );

    this.exportService.downloadFile(customizedRatelist, filename);
  }
}
