import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-fxrateoverview',
  templateUrl: './fxrateoverview.component.html',
  styleUrls: ['./fxrateoverview.component.scss'],
})
export class FxrateoverviewComponent implements OnInit {
  selectedBlock = 1;
  currentDataRate: any;
  usdRate: number | undefined;

  setSelectedBlock(blockNumber: number) {
    this.selectedBlock = blockNumber;
  }

  constructor(private apiService: ApiService, protected dialog: MatDialog) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService
      .getRequest('fx/latest-rate')
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.currentDataRate = data.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
