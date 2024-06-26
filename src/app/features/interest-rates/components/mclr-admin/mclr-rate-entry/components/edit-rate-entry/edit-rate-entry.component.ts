import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-rate-entry',
  templateUrl: './edit-rate-entry.component.html',
  styleUrls: ['./edit-rate-entry.component.scss'],
})
export class EditRateEntryComponent implements OnInit {
  protected closeIcon = faXmark;
  protected dataSource: Array<any> = [];
  protected displayedColumns = [
    'No',
    'Bank Code',
    'Bank Name',
    'Effective Date',
    'URL',
    'Action',
  ];

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditRateEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    const params = { bank_code: this.data['bank']['bank_code'] };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getBankDateEffLst',
        params
      )
      .subscribe({
        next: (data: any) => {
          this.dataSource = data['data'];
        },
      });
  }

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

  protected openEditNav(bank: any) {
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
          response.data.forEach((element: any) => {
            this.mclrEditRateForm.patchValue({
              bankCode: bank.bank_code,
              effectiveDate: bank.effective_date,
              mclrUrl: bank.url_mclr_update,
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
          this.dialogRef.close({
            data: this.mclrEditRateForm.value,
            editable: this.data['action'] == 'edit',
          });
        },
      });
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
