import { Component, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss'],
})
export class AddTemplateComponent {
  @Output() closeEvent = new EventEmitter<string>();
  id: any;
  templateinfoFormParams: any = [];
  params: any;
  pftemplatecnf: any = [];
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private apiService: ApiService) {}

  templateinfoForm = new FormGroup({
    value: new FormControl(''),
    des: new FormControl(''),
  });

  templateinfoentry() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'createPortfolioTemplateConfig',
        this.templateinfoForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('New Template Added');
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
