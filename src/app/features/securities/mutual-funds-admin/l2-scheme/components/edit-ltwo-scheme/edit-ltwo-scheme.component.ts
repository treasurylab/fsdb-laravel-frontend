import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import {
  faPenToSquare,
  faSave,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export interface schemeTypeLists {
  name: string;
}
@Component({
  selector: 'app-edit-ltwo-scheme',
  templateUrl: './edit-ltwo-scheme.component.html',
  styleUrls: ['./edit-ltwo-scheme.component.scss'],
})
export class EditLtwoSchemeComponent implements OnInit {
  id: any;
  listFund: any;
  schemeinfoform: FormGroup;

  schemeTypeList: schemeTypeLists[] = [
    { name: 'Open Ended Schemes' },
    { name: 'Close Ended Schemes' },
    { name: 'Interval Ended Schemes' },
  ];

  protected editIcon = faPenToSquare;
  protected saveIcon = faSave;
  protected closeIcon = faXmark;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditLtwoSchemeComponent>
  ) {
    this.schemeinfoform = new FormGroup({
      schemetype: new FormControl(''),
      fundhouse: new FormControl(''),
      sebi_name: new FormControl(''),
      link_symbol: new FormControl(''),
      name: new FormControl(''),
      id: new FormControl(''),
      isin1: new FormControl(''),
      isin2: new FormControl(''),
      symbol: new FormControl(''),
      sname: new FormControl(''),
      closed_flag: new FormControl(''),
      launch_date: new FormControl(''),
      closure_date: new FormControl(''),
      amfi_catg: new FormControl(''),
      stype: new FormControl(''),
    });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.schemeinfoform?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.id = this.data.id;
    this.getSchemeInfo(this.id);
    this.lTwoSchemeEditingData();
  }

  protected populateUpdateForm(data: any) {
    this.schemeinfoform.patchValue({
      schemetype: data.schemetype,
      fundhouse: data.fundhouse,
      sebi_name: data.sebi_name,
      link_symbol: data.link_symbol,
      name: data.name,
      id: data.id,
      isin1: data.isin1,
      isin2: data.isin2,
      symbol: data.symbol,
      sname: data.sname,
      closed_flag: data.closed_flag,
      launch_date: data.launch_date,
      closure_date: data.closure_date,
      amfi_catg: data.amfi_catg,
      stype: data.stype,
    });
  }

  lTwoSchemeEditingData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'lTwoSchemeEditingData'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.listFund = data['data']['list_fund'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getSchemeInfo(id: number) {
    const requestParams = { id };
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'getSingleSchemeInfo',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.populateUpdateForm(data.data);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected schemeInfoUpdate() {
    const schemeinfoParams = this.schemeinfoform.value;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'setSchemeClassification',
        schemeinfoParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
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
