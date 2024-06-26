import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  faPenToSquare,
  faSave,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-update-symbol',
  templateUrl: './update-symbol.component.html',
  styleUrls: ['./update-symbol.component.scss'],
})
export class UpdateSymbolComponent implements OnInit {
  modalData: any;
  id: any;
  sebi1info: any = [];
  sebiinfoedit = false;
  showListing = true;
  sebiinfoFormParams: any = [];
  sebiCategories: any[] = [];

  params: any;
  fundmanager: any;
  mfServices: any;
  singlel1scheme: any;
  dataSource1: any;
  l1scheme_id: any;
  list1: any;
  sid: any;
  dataSource5: any;

  displayedColumnDW4 = [
    'amfi',
    'isin',
    'bpid',
    'amficat',
    'schemecat',
    `symbol`,
    `link symbol`,
    `closing`,
    `created`,
    `scheme`,
  ];
  symbolData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<UpdateSymbolComponent>
  ) {
    this.modalData = data?.items;
  }
  objectKeys(obj: any) {
    return Object.keys(obj).map((key) => obj[key]);
  }
  isset(object: any) {
    return typeof object !== 'undefined';
  }
  ngOnInit(): void {
    this.id = this.modalData.id;
    this.populateUpdateForm();
  }

  protected editIcon = faPenToSquare;
  protected saveIcon = faSave;
  protected closeIcon = faXmark;

  sebiinfoForm = new FormGroup({
    linksym: new FormControl(''),
  });
  protected getFormControllers(name: string) {
    const ctrl = this.sebiinfoForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  populateUpdateForm(info?: any) {
    if (info) {
      this.sebiinfoForm.patchValue({
        linksym: info.linksym,
      });
    }
  }

  updateSymbol() {
    const requestParams: any = this.sebiinfoForm.value;
    requestParams['id'] = this.data.id;

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'updateLinkSymbol',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.closeModal();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  editRec(params: any) {
    this.sebiinfoedit = true;
    this.showListing = false;
    this.populateUpdateForm(this.symbolData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
