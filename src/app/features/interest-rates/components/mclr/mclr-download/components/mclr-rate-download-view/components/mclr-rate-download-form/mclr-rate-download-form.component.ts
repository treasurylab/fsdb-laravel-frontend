import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-mclr-rate-download-form',
  templateUrl: './mclr-rate-download-form.component.html',
  styleUrl: './mclr-rate-download-form.component.scss',
})
export class MclrRateDownloadFormComponent {
  @Input({ required: true }) allCompanies = new Array<any>();
  @Output() formDataProbe = new EventEmitter<any>();
  protected tabs = ['Key Date', 'Range'];
  protected activeTab = 'Key Date';
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;
  protected mclrDownloadForm = new FormGroup({
    compcode: new FormControl('', Validators.required),
    fromdate: new FormControl('', Validators.required),
    todate: new FormControl(''),
    selectedOption: new FormControl('A', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private datePipe: DatePipe) {}

  protected onTabChange(event: string): void {
    this.activeTab = event;
    if (event === this.tabs[0]) {
      this.mclrDownloadForm.patchValue({
        selectedOption: 'A',
      });
      this.mclrDownloadForm.get('todate')?.clearValidators();
    } else {
      this.mclrDownloadForm.patchValue({
        selectedOption: 'B',
      });
      this.mclrDownloadForm.get('todate')?.setValidators(Validators.required);
    }
    this.mclrDownloadForm.get('todate')?.updateValueAndValidity();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.mclrDownloadForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected submitFormData() {
    if (this.mclrDownloadForm.valid) {
      const rateListData: any = this.mclrDownloadForm.value;
      rateListData.fromdate = new Date(rateListData.fromdate);
      rateListData.fromdate = this.datePipe.transform(
        rateListData.fromdate,
        'yyyy-MM-dd'
      );
      if (rateListData.selectedOption == 'B') {
        rateListData.todate = new Date(rateListData.todate);
        rateListData.todate = this.datePipe.transform(
          rateListData.todate,
          'yyyy-MM-dd'
        );
      }
      this.formDataProbe.emit(rateListData);
    } else {
      alert('Form is invalid');
    }
  }
}
