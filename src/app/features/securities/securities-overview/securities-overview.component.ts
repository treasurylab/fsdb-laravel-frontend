import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-securities-overview',
  templateUrl: './securities-overview.component.html',
  styleUrls: ['./securities-overview.component.scss'],
})
export class SecuritiesOverviewComponent implements OnInit {
  topMfSebiDS: string[] = [];
  topMfSebiColumns: string[] = [
    'AmfiCategory',
    'SebiCategory',
    'CurrentNAV',
    'PrevNAV',
    'Percentchange',
  ];

  params: any;
  listbp: any;
  listscheme: any;

  constructor(private apiService: ApiService) {}

  fundhouse: number = 0;
  schemeCount: number = 0;
  sensex50: number = 0;
  nifty50: number = 0;

  mutualFundLastUpdated: string = 'Loading..';

  ngOnInit(): void {
    this.getSecurityOverviewData();
    this.getSebiTableData('all');
  }

  getSecurityOverviewData() {
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getSecOverviewData', this.params)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.fundhouse = data['data']['fundhouse'];
          this.schemeCount = data['data']['scheme'];
          this.nifty50 = data['data']['nifty'];
          this.sensex50 = data['data']['sensex'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getSebiTableData(category: string) {
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getMfDashboardSEBITable', [
        category,
      ])
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.topMfSebiDS = data['data'].filter((item: any) => {
            return Object.values(item).some((value) => value !== null);
          });
        },
        error: (err: any) => {},
      });
  }
}
