import { Component, Inject } from '@angular/core';
import { first } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.scss'],
})
export class AddPortfolioComponent {
  id: any;
  params: any;
  modalData: any;
  pfassetcnf: any = [];
  prodcodedata: any = [];
  formdata: any = [];
  pfinfoFormParams: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddPortfolioComponent>
  ) {
    this.modalData = data?.items;
  }

  pfinfoForm = new FormGroup({
    isin_no: new FormControl(''),
    market_value: new FormControl(''),
    rating: new FormControl(''),
    sec_type: new FormControl(''),
    isin_name: new FormControl(''),
  });

  ngOnInit(): void {
    this.prodcodedata = this.modalData.prodcodedata;
    this.formdata = this.modalData.selecteddata;
  }

  pfinfoentry() {
    this.pfinfoFormParams = this.pfinfoForm.value;
    this.pfinfoFormParams.formdata = this.formdata;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'createPortfolioTemplateConfig',
        this.pfinfoFormParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('New Portfolio Added');
          this.closeMe();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  closeMe() {
    this.dialogRef.close();
  }
}
