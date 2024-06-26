import { Component, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-add-asset-type',
  templateUrl: './add-asset-type.component.html',
  styleUrls: ['./add-asset-type.component.scss'],
})
export class AddAssetTypeComponent {
  @Output() closeEvent = new EventEmitter<string>();
  id: any;
  assetinfoFormParams: any = [];
  params: any;
  pfassetcnf: any = [];
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private apiService: ApiService) {}

  assetinfoForm = new FormGroup({
    value: new FormControl(''),
    des: new FormControl(''),
  });

  assetinfoentry() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'createPortfolioAssetConfig',
        this.assetinfoForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('New Asset type Added');
          this.closeMe();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private pfAssetConfig() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getPortfolioAssetConfigList'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.pfassetcnf = data['data'];
            this.dataSource1 = new MatTableDataSource(this.pfassetcnf);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected getFormControllers(name: string) {
    const ctrl = this.assetinfoForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  closeMe() {
    this.closeEvent.emit('close');
    this.pfAssetConfig();
  }
}
