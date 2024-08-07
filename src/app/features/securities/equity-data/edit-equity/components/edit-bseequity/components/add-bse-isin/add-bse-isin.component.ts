import { Component, Inject } from '@angular/core';
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
  selector: 'app-add-bse-isin',
  templateUrl: './add-bse-isin.component.html',
  styleUrl: './add-bse-isin.component.scss',
})
export class AddBseIsinComponent {
  protected editIcon = faPenToSquare;
  protected saveIcon = faSave;
  protected closeIcon = faXmark;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddBseIsinComponent>
  ) {}

  bseisininfo = new FormGroup({
    bse_code: new FormControl(''),
    isin_no: new FormControl(''),
    symbol: new FormControl(''),
    company_name: new FormControl(''),
    bp_id: new FormControl(''),
    listing_date: new FormControl(''),
    market_lot: new FormControl(''),
    paid_up_value: new FormControl(''),
    face_value: new FormControl(''),
    is_exchange: new FormControl(''),
    sensex50: new FormControl(''),
    sensex200: new FormControl(''),
    bse_group: new FormControl(''),
    market_capitalization: new FormControl(''),
    short_description: new FormControl(''),
    industry: new FormControl(''),
  });

  protected getFormControllers(name: string) {
    const ctrl = this.bseisininfo?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected closeModal() {
    this.dialogRef.close();
  }

  bseEquityIsinEntry() {
    const requestParams: any = this.bseisininfo.value;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.equity,
        'bseEquityIsinEntry',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.closeModal();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
