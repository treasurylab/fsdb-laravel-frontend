import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-ulip-scheme',
  templateUrl: './edit-ulip-scheme.component.html',
  styleUrls: ['./edit-ulip-scheme.component.scss'],
})
export class EditUlipSchemeComponent {
  modalData: any;
  id: any;
  name: any;
  sname: any;
  rstatus: any;
  ulipScheme: any = [];
  sebiinfoedit = false;
  showListing = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditUlipSchemeComponent>
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
    this.getUlipScheme(this.id);
  }

  fhForm = new FormGroup({
    sec_id: new FormControl(''),
    isin: new FormControl(''),
    sname: new FormControl(''),
    fhname: new FormControl(''),
    rstatus: new FormControl(''),
  });

  populateUpdateForm(info?: any) {
    if (info) {
      this.fhForm.patchValue({
        sec_id: info.sec_id,
        isin: info.isin_no,
        sname: info.sname,
        fhname: info.fhname,
        rstatus: info.rstatus,
      });
    }
  }

  getUlipScheme(id?: any) {
    const requestParam = {
      id: id,
    };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'getUlipScheme',
        requestParam
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.ulipScheme = data['data'][0];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateulipScheme() {
    const requestParams: any = this.fhForm.value;
    requestParams['id'] = this.data.sec_id;

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'updateulipScheme',
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
    this.populateUpdateForm(this.ulipScheme);
  }

  closeMe() {
    this.dialogRef.close();
  }
}
