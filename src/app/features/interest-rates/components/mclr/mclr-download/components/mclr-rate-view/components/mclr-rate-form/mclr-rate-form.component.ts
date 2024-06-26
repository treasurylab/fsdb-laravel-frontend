import { ApiService } from 'src/app/shared/services/api/api.service';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mclr-rate-form',
  templateUrl: './mclr-rate-form.component.html',
  styleUrl: './mclr-rate-form.component.scss',
})
export class MclrRateFormComponent {
  @Input({ required: true }) tenorList = new Array<{
    mfreq_code: string;
    mfreq_type: string;
  }>();
  @Input({ required: true }) allCompanies = new Array<any>();
  @Output() formDataOut = new EventEmitter<any>();

  protected bankList = new Array();
  protected mclrRateForm = new FormGroup({
    compInfo: new FormControl(''),
    bankInfo: new FormControl(''),
    tenor: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });
  protected filterIcon = faFilter;

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  protected sendFormData() {
    const mclrRateData: any = this.mclrRateForm.value;
    mclrRateData.fromDate = this.datePipe.transform(
      mclrRateData.fromDate,
      'yyyy-MM-dd'
    );
    mclrRateData.toDate = new Date(mclrRateData.toDate);
    mclrRateData.toDate = this.datePipe.transform(
      mclrRateData.toDate,
      'yyyy-MM-dd'
    );
    const tenorCode = mclrRateData.tenor;
    mclrRateData.tenor = {
      mfreq_code: tenorCode,
    };
    for (let i = 0; i < this.tenorList.length; i++) {
      if (this.tenorList[i].mfreq_code === mclrRateData.tenor.mfreq_code) {
        mclrRateData.tenor.mfreq_type = this.tenorList[i].mfreq_type;
      }
    }
    console.log(mclrRateData);

    this.formDataOut.emit(mclrRateData);
  }

  protected getFormControllers(name: string) {
    const ctrl = this.mclrRateForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getCompBank() {
    const comp: any = this.mclrRateForm.get('compInfo')?.value ?? undefined;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getCompBank',
        {
          comp_code: comp !== undefined ? comp : '',
        }
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.bankList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
