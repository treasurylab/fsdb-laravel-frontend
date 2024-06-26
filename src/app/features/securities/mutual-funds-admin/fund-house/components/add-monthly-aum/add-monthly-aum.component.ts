import { Component, Inject, OnInit } from '@angular/core';
import { filter, first } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  faFilter,
  faSearch,
  faXmark,
  faSave,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

export interface years {
  id: number;
  name: number;
}
export interface months {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-monthly-aum',
  templateUrl: './add-monthly-aum.component.html',
  styleUrls: ['./add-monthly-aum.component.scss'],
})
export class AddMonthlyAumComponent implements OnInit {
  id: any;
  auminfoFormParams: any = [];
  fundhouses: any = [];

  allyears: years[] = [
    { id: 2027, name: 2027 },
    { id: 2026, name: 2026 },
    { id: 2025, name: 2025 },
    { id: 2024, name: 2024 },
    { id: 2023, name: 2023 },
    { id: 2022, name: 2022 },
    { id: 2021, name: 2021 },
    { id: 2020, name: 2020 },
    { id: 2019, name: 2019 },
    { id: 2018, name: 2018 },
    { id: 2017, name: 2017 },
    { id: 2016, name: 2016 },
  ];

  allmonths: months[] = [
    { id: '1', name: 'January' },
    { id: '2', name: 'February' },
    { id: '3', name: 'March' },
    { id: '4', name: 'April' },
    { id: '5', name: 'May' },
    { id: '6', name: 'June' },
    { id: '7', name: 'July' },
    { id: '8', name: 'August' },
    { id: '9', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];
  protected filterIcon = faFilter;
  protected searchIcon = faSearch;
  protected closeIcon = faXmark;
  protected saveIcon = faSave;
  protected editIcon = faPenToSquare;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddMonthlyAumComponent>
  ) {}

  ngOnInit(): void {
    this.gdbp();
  }

  aumForm = new FormGroup({
    year: new FormControl(''),
    month: new FormControl(''),
    fundHouseId: new FormControl(''),
    aum: new FormControl(''),
  });

  protected getFormControllers(name: string) {
    const ctrl = this.aumForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  gdbp() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'getBpData'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.fundhouses = data['data']['listFund'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  aumInfoEntry() {
    const requestParams: any = this.aumForm.value;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'aumInfoEntry',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('AUM Added');
          this.closeModal();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected closeModal() {
    this.dialogRef.close();
  }
}
