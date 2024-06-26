import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-asset-type',
  templateUrl: './edit-asset-type.component.html',
  styleUrls: ['./edit-asset-type.component.scss'],
})
export class EditAssetTypeComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<string>();
  @Input() data: any;
  id: any;
  params: any;
  modalData: any;
  singleAssetData: any = [];
  assetinfoFormParams1: any = [];
  pfassetcnf: any = [];
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  assetinfoForm = new FormGroup({
    value: new FormControl(''),
    des: new FormControl(''),
  });

  constructor(private apiService: ApiService) {}
  objectKeys(obj: any) {
    return Object.keys(obj).map((key) => obj[key]);
  }
  isset(object: any) {
    return typeof object !== 'undefined';
  }

  ngOnInit(): void {
    this.modalData = this.data;
    this.id = this.modalData.id;
    this.populateUpdateForm();
  }

  populateUpdateForm() {
    if (this.data !== undefined) {
      this.assetinfoForm.patchValue({
        value: this.data.code,
        des: this.data.name,
      });
    }
  }

  assetinfoupdate() {
    const requestParams: any = this.assetinfoForm.value;
    requestParams['id'] = this.data.id;

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'updatePortfolioAssetConfig',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('Asset type Updated');
          this.closeMe();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  pfAssetConfig() {
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
