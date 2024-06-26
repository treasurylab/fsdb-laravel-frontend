import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<string>();
  @Input() data: any;
  id: any;
  params: any;
  modalData: any;
  singletemplateData: any = [];
  templateinfoFormParams1: any = [];
  pftemplatecnf: any = [];
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();

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
    console.log(this.data);

    this.populateUpdateForm();
  }

  templateinfoForm = new FormGroup({
    value: new FormControl(''),
    des: new FormControl(''),
  });

  populateUpdateForm() {
    this.templateinfoForm.patchValue({
      value: this.data.code,
      des: this.data.name,
    });
  }

  templateinfoupdate() {
    const requestParams: any = this.templateinfoForm.value;
    requestParams['id'] = this.data.id;

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'updatePortfolioTemplateConfig',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('Template Updated');
          this.closeMe();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  pftemplateconfig() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getPortfolioTemplateConfig'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.pftemplatecnf = data['data'];
            this.dataSource1 = new MatTableDataSource(this.pftemplatecnf);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected getFormControllers(name: string) {
    const ctrl = this.templateinfoForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  closeMe() {
    this.closeEvent.emit('close');
    this.pftemplateconfig();
  }
}
