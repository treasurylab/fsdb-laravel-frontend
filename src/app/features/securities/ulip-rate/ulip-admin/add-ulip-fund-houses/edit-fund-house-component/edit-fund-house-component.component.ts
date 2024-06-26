import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-fund-house-component',
  templateUrl: './edit-fund-house-component.component.html',
  styleUrls: ['./edit-fund-house-component.component.scss'],
})
export class EditFundHouseComponent implements OnInit {
  modalData: any;
  id: any;
  name: any;
  sname: any;
  rstatus: any;
  ulipFundHouse: any = [];
  sebiinfoedit = false;
  showListing = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditFundHouseComponent>
  ) {
    this.modalData = data;
  }
  objectKeys(obj: any) {
    return Object.keys(obj).map((key) => obj[key]);
  }
  isset(object: any) {
    return typeof object !== 'undefined';
  }
  ngOnInit(): void {
    // console.log(this.modalData);
    this.id = this.modalData;
    this.getFundHouse(this.id);
  }

  fhForm = new FormGroup({
    bp_id: new FormControl(''),
    bp_name: new FormControl(''),
    bp_sname: new FormControl(''),
    rstatus: new FormControl(''),
  });

  populateUpdateForm(info?: any) {
    if (info) {
      this.fhForm.patchValue({
        bp_id: info.bp_id,
        bp_name: info.bp_name,
        bp_sname: info.bp_sname,
        rstatus: info.rstatus,
      });
    }
  }

  getFundHouse(id?: any) {
    const requestParam = {
      id: id,
    };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'getUlipFundHouse',
        requestParam
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.ulipFundHouse = data['data'][0];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateUlipFundHouse() {
    const requestParams: any = this.fhForm.value;
    requestParams['id'] = this.data.bp_id;

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'updateUlipFundHouse',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.closeMe();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  editRec() {
    this.sebiinfoedit = true;
    this.showListing = false;
    this.populateUpdateForm(this.ulipFundHouse);
  }

  closeMe() {
    this.dialogRef.close();
  }
}
