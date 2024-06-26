import { Component, Inject } from '@angular/core';
import { first } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import {
  faFilter,
  faSearch,
  faXmark,
  faSave,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-monthly-aum',
  templateUrl: './edit-monthly-aum.component.html',
  styleUrls: ['./edit-monthly-aum.component.scss'],
})
export class EditMonthlyAumComponent {
  singleaumdata: any = [];
  auminfoFormParams: any = [];
  fundhouses: any = [];
  id: any;

  protected allyears = [
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

  protected allmonths = [
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
  protected deleteIcon = faTrash;

  protected editAumForm = new FormGroup({
    year: new FormControl(''),
    month: new FormControl(''),
    fundHouseName: new FormControl(''),
    aum: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditMonthlyAumComponent>
  ) {}
  objectKeys(obj: any) {
    return Object.keys(obj).map((key) => obj[key]);
  }
  isset(object: any) {
    return typeof object !== 'undefined';
  }

  ngOnInit(): void {
    this.getBpData();
    this.editAumForm.patchValue({
      year: this.data.year,
      month: this.data.quarter,
      aum: this.data.aum_amount,
    });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.editAumForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  populateUpdateForm(info?: any) {
    if (info) {
    }
  }

  private getBpData() {
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
            setTimeout(() => {
              const fhName = this.data.bp_name;
              for (let i = 0; i < this.fundhouses.length; i++) {
                if (this.fundhouses[i].name == fhName) {
                  this.editAumForm.patchValue({
                    fundHouseName: this.fundhouses[i].id,
                  });
                  break;
                }
              }
            }, 50);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected editAumMonthly() {
    const requestParams: any = this.editAumForm.value;
    requestParams['id'] = this.data.id;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'aumInfoEntry',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('Aum Updated');
          this.closeModal();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected deleteRecord() {
    if (
      confirm(
        `Are you sure to delete this item (${this.data.id} - ${this.data.bp_name})?`
      )
    ) {
      this.apiService
        .postRequestLegacy(FeatureList.mfFundhouse, 'deleteAaum', {
          id: this.data.id,
          name: this.data.bp_name,
        })
        .pipe(first())
        .subscribe({
          next: (_) => {
            console.log('Sebi category Deleted');
            this.closeModal();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  protected closeModal() {
    this.dialogRef.close();
  }
}
