import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-add-edit-lone-sch-form',
  templateUrl: './add-edit-lone-sch-form.component.html',
  styleUrl: './add-edit-lone-sch-form.component.scss',
})
export class AddEditLoneSchFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Input({ required: true }) sideNavTitle!: string;
  @Input({ required: true }) formPayload!: any;
  @Output() formCallback = new EventEmitter<boolean>();
  protected deleteIcon = faTrash;

  protected sebiCategories = new Array<any>();
  protected fundHouseList = new Array<any>();
  protected ex_symbol = '';
  protected lOneSchemeForm = new FormGroup({
    lOneName: new FormControl(''),
    fundHouse: new FormControl(''),
    sebiCat: new FormControl(''),
    linkSym: new FormControl(''),
    lOneSym: new FormControl(''),
  });

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.lOneSchemeEditingData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formPayload'] && this.formPayload) {
      if (this.formPayload.payload === undefined) {
        this.lOneSchemeForm.reset();
      } else {
        this.refreshPayload();
      }
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.lOneSchemeForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private refreshPayload() {
    const formData = this.formPayload.payload;
    let fundHouse: any = '';
    for (let i = 0; i < this.fundHouseList.length; i++) {
      if (this.fundHouseList[i].name === formData.bp_name) {
        fundHouse = this.fundHouseList[i].id;
        break;
      }
    }
    this.lOneSchemeForm.setValue({
      lOneName: formData.l1scheme_name,
      fundHouse: fundHouse,
      sebiCat: formData.sebi_catg,
      linkSym: formData.l1_symbol,
      lOneSym: this.ex_symbol,
    });
  }

  private lOneSchemeEditingData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'lOneSchemeEditingData'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sebiCategories = data['data']['all_sebi_list'];
          this.fundHouseList = data['data']['list_fund'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected loneInfoEntry() {
    const requestParams: any = this.lOneSchemeForm?.value;
    const fundHouseId = this.lOneSchemeForm.get('fundHouse')?.value;
    let fundHouseSymbol: any;
    for (let i = 0; i < this.fundHouseList.length; i++) {
      if (this.fundHouseList[i].id == fundHouseId) {
        fundHouseSymbol = this.fundHouseList[i].symbol;
        break;
      }
    }

    requestParams['id'] = this.formPayload.payload?.id ?? '';
    requestParams['fundHouse'] = fundHouseSymbol;
    requestParams['fundHouseId'] = fundHouseId;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'lOneInfoEntry',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          alert(data['message']);
          this.formCallback.emit(true);
          this.closeNav();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected deleteRecord() {
    if (confirm('Are you sure to delete this item?')) {
      const requestParam = {
        id: this.formPayload.payload.l1scheme_id,
      };
      this.apiService
        .getRequestLegacy<GenericResponse<any>>(
          FeatureList.lOneScheme,
          'deleteLOneScheme',
          requestParam
        )
        .pipe(first())
        .subscribe({
          next: (_) => {
            alert('L1 Scheme Deleted');
            this.formCallback.emit(true);
            this.closeNav();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  protected closeNav() {
    this.lOneSchemeForm?.reset();
    this.sideNavObj.toggleFormNav();
  }
}
