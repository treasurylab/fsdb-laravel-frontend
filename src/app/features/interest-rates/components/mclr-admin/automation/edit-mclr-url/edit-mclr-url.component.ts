import { FeatureList } from './../../../../../../../features';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-edit-mclr-url',
  templateUrl: './edit-mclr-url.component.html',
  styleUrls: ['./edit-mclr-url.component.scss'],
})
export class EditMclrUrlComponent implements OnInit {
  protected bankUrlForm = new FormGroup({
    url: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditMclrUrlComponent>
  ) {}

  ngOnInit(): void {
    this.bankUrlForm.patchValue({
      url: this.data['bankInfo']['url'],
    });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.bankUrlForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected updatebankurl() {
    const requestParams: any = this.bankUrlForm.value;
    requestParams['bank_code'] = this.data['bankInfo']['bank_code'];
    this.apiService
      .postRequestLegacy(FeatureList.mclr, 'updateBankUrl', requestParams)
      .pipe(first())
      .subscribe({
        next: (_: any) => {
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
