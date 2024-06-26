import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-fund-house-form',
  templateUrl: './edit-fund-house-form.component.html',
  styleUrl: './edit-fund-house-form.component.scss',
})
export class EditFundHouseFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Input({ required: true }) sideNavTitle!: string;
  @Input({ required: true }) formPayload!: any;
  @Output() formCallback = new EventEmitter<boolean>();
  protected deleteIcon = faTrash;

  protected sebiCategories = new Array<any>();
  protected fundHouseList = new Array<any>();
  protected ex_symbol = '';
  protected fundhinfoForm = new FormGroup({
    symbol: new FormControl(''),
    name: new FormControl(''),
    sname: new FormControl(''),
    bpType: new FormControl(''),
  });
  types: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.gdbp();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formPayload'] && this.formPayload) {
      if (this.formPayload.payload === undefined) {
        this.fundhinfoForm.reset();
      } else {
        this.refreshPayload();
      }
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.fundhinfoForm?.get(name) as FormControl;
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
    this.fundhinfoForm.setValue({
      symbol: formData.symbol,
      name: formData.name,
      sname: formData.sname,
      bpType: formData.bpType || 'FUNDHSG',
    });
  }

  private gdbp() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'getBpData'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.types = data['data']['allBpType'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  bpInfoEntry() {
    const requestParams: any = this.fundhinfoForm.value;
    requestParams['id'] = this.formPayload.id;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'bpInfoEntry',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('Fund house Updated');
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
        id: this.formPayload.payload.id,
      };
      this.apiService
        .getRequestLegacy<GenericResponse<any>>(
          FeatureList.mfFundhouse,
          'deleteFundHouse',
          requestParam
        )
        .pipe(first())
        .subscribe({
          next: (_) => {
            alert('Fund House Deleted');
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
    this.fundhinfoForm?.reset();
    this.sideNavObj.toggleFormNav();
  }
}
