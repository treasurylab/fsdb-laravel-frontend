import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  faPenToSquare,
  faSave,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-factsheet',
  templateUrl: './edit-factsheet.component.html',
  styleUrls: ['./edit-factsheet.component.scss'],
})
export class EditFactsheetComponent implements OnInit {
  protected statusList: any;
  protected factsheetform = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    pf_amt: new FormControl(''),
    month_aum: new FormControl(''),
    avg_maturity: new FormControl(''),
    mod_duration: new FormControl(''),
    gross_ytm: new FormControl(''),
    exp_ratio: new FormControl(''),
    lock_prd: new FormControl(''),
    exit_load: new FormControl(''),
    reason_code: new FormControl(''),
  });
  protected editIcon = faPenToSquare;
  protected saveIcon = faSave;
  protected closeIcon = faXmark;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditFactsheetComponent>
  ) {}

  ngOnInit(): void {
    this.lOneSchemeEditingData();
    this.populateUpdateForm();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.factsheetform?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  populateUpdateForm() {
    if (this.data.factData !== undefined) {
      this.factsheetform.patchValue({
        id: this.data.factData.id,
        name: this.data.factData.name,
        pf_amt: this.data.factData.pf_amt,
        month_aum: this.data.factData.month_aum,
        avg_maturity: this.data.factData.avg_maturity,
        mod_duration: this.data.factData.mod_duration,
        gross_ytm: this.data.factData.gross_ytm,
        exp_ratio: this.data.factData.exp_ratio,
        lock_prd: this.data.factData.lock_prd,
        exit_load: this.data.factData.exit_load,
        reason_code: this.data.factData.reason_code,
      });
    }
  }

  private lOneSchemeEditingData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'lOneSchemeEditingData'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.statusList = data['data']['list_status'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected factsheetInfoUpdate() {
    const requestParams: any = this.factsheetform.value;
    requestParams['month'] = this.data.formData.month;
    requestParams['year'] = this.data.formData.year;
    requestParams['fmList'] = this.data.formData.fmList;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'factsheetEntry',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          alert(data['message']);
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
