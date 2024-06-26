import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mclr-comp-specific',
  templateUrl: './mclr-comp-specific.component.html',
  styleUrls: ['./mclr-comp-specific.component.scss'],
})
export class MclrCompSpecificComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  protected searchController = new FormControl<string>('');
  protected bankCodeController = new FormControl<string[]>([]);
  protected filterIcon = faFilter;
  protected addIcon = faPlus;
  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns = [
    'srno',
    'bankcode',
    'bankname',
    'lastupdate',
    'cid',
    'cdt',
    'status',
  ];
  protected banksList: any;
  protected selectedBanks = new Array<string>();

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMclrBankList();
    this.getData();
  }

  protected compareBanks(bank1: any, bank2: any): boolean {
    return bank1 && bank2
      ? bank1.bank_code === bank2.bank_code
      : bank1 === bank2;
  }

  private getData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getAllBankList'
      )
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.banksList = response.data;
          this.selectedBanks = new Array<string>();
          this.banksList.forEach((bank: any) => {
            if (bank.selected) {
              this.selectedBanks.push(bank.bank_code);
            }
          });
          this.bankCodeController.setValue(this.selectedBanks);
        },
      });
  }

  protected onSelectionChanged(modalOpen: boolean) {
    if (!modalOpen) {
      const controllerValue = this.bankCodeController.value;
      if (this.selectedBanks === controllerValue) {
        return;
      }
      if (controllerValue && controllerValue.length > 0) {
        let payload = this.banksList.map((a: any) => {
          return { ...a };
        });
        payload = payload.map((bank: any) => {
          if (!controllerValue.includes(bank.bank_code)) {
            bank.selected = false;
          } else {
            bank.selected = true;
          }
          return bank;
        });
        this.apiService
          .postRequestLegacy<GenericResponse<any>>(
            FeatureList.mclr,
            'addAndRemoveBankList',
            { payload: payload }
          )
          .pipe(first())
          .subscribe({
            next: (_) => {
              this.getData();
              this.getMclrBankList();
            },
            error: (err: any) => {
              console.log(err);
            },
          });
      }
    }
  }

  private getMclrBankList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(FeatureList.mclr, 'mclrCgrpBanks')
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.dataSource.data = data.data;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected applyFilter() {
    const filterValue = this.searchController.value ?? '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
