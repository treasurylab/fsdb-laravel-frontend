import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankMclr } from 'src/app/models/mclr/bank_mclr';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-add-rate-entry',
  templateUrl: './add-rate-entry.component.html',
  styleUrls: ['./add-rate-entry.component.scss'],
})
export class AddRateEntryComponent implements OnInit {
  protected selectedBank = '';
  protected bankList: Array<BankMclr> = [];

  protected file?: File;
  protected selectedFileName = '';

  selectedFile: File | null = null;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddRateEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    this.bankList = this.data;
  }

  protected mclrRateForm = new FormGroup({
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

  onFileSelected(files: FileList | null) {
    if (files && files.length > 0) {
      this.selectedFile = files.item(0);
    } else {
      this.selectedFile = null;
    }
  }

  protected create() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.mclr,
        fileObject,
        'createMclrMastEntry',
        this.mclrRateForm.value
      )

      .subscribe({
        next: (response: any) => {
          this.closeMe();
          window.location.reload();
        },
      });
  }

  public closeMe() {
    this.dialogRef.close();
  }
}
