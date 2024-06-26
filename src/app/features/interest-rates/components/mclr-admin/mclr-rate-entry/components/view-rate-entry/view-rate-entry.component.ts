import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-view-rate-entry',
  templateUrl: './view-rate-entry.component.html',
  styleUrls: ['./view-rate-entry.component.scss'],
})
export class ViewRateEntryComponent {
  protected editFlag = false;
  protected selectedBank: any;

  protected url = '';
  protected fetchedData: Array<any> = [];
  protected displayedColumns = [
    'No',
    'Bank Code',
    'Bank Name',
    'Effective Date',
    'URL',
    'Action',
  ];

  protected mclrEditRateForm = new FormGroup({
    bankCode: new FormControl(''),
    effectiveDate: new FormControl(''),
    mclrUrl: new FormControl(''),
    overnight: new FormControl(''),
    oneMonth: new FormControl(''),
    threeMonth: new FormControl(''),
    sixMonth: new FormControl(''),
    oneYear: new FormControl(''),
    twoYear: new FormControl(''),
    threeYear: new FormControl(''),
    fiveYear: new FormControl(''),
  });

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ViewRateEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    const params = { bank_code: this.data['bank_code'] };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getBankDateEffLst',
        params
      )
      .subscribe({
        next: (data: any) => {
          this.fetchedData = data['data'];
        },
      });
  }

  openEditDialog(bank: any) {
    this.selectedBank = bank;
    const requestParams = {
      bank_code: bank.bank_code,
      effective_date: bank.effective_date,
    };

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getOneMclrMastEntry',
        requestParams
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          response.data.forEach((element: any) => {
            this.mclrEditRateForm.patchValue({
              bankCode: this.selectedBank.bank_code,
              effectiveDate: this.selectedBank.effective_date,
              mclrUrl: this.selectedBank.url_mclr_update,
            });
            switch (element['frequency_type']) {
              case 'Overnight':
                this.mclrEditRateForm.patchValue({
                  overnight: element['mclr_rate'],
                });
                break;
              case '1 Month':
                this.mclrEditRateForm.patchValue({
                  oneMonth: element['mclr_rate'],
                });
                break;
              case '3 Months':
                this.mclrEditRateForm.patchValue({
                  threeMonth: element['mclr_rate'],
                });
                break;
              case '6 Months':
                this.mclrEditRateForm.patchValue({
                  sixMonth: element['mclr_rate'],
                });
                break;
              case '1 Year':
                this.mclrEditRateForm.patchValue({
                  oneYear: element['mclr_rate'],
                });
                break;
              case '2 Years':
                this.mclrEditRateForm.patchValue({
                  twoYear: element['mclr_rate'],
                });
                break;
              case '3 Years':
                this.mclrEditRateForm.patchValue({
                  threeYear: element['mclr_rate'],
                });
                break;
              case '5 Years':
                this.mclrEditRateForm.patchValue({
                  fiveYear: element['mclr_rate'],
                });
                break;
            }
          });
          this.url = this.selectedBank.url_mclr_update;
          this.editFlag = true;
        },
      });
  }

  public closeMe() {
    this.dialogRef.close();
  }

  public closeUpdate() {
    this.editFlag = false;
  }
}
