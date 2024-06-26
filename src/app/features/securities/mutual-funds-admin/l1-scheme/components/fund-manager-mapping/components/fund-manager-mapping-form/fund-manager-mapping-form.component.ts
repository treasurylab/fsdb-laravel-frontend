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
import {
  faFilter,
  faMagnifyingGlass,
  faSave,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-fund-manager-mapping-form',
  templateUrl: './fund-manager-mapping-form.component.html',
  styleUrl: './fund-manager-mapping-form.component.scss',
})
export class FundManagerMappingFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) sideNavTitle!: string;
  @Input({ required: true }) formPayload!: {
    action: string;
    payload?: any;
  };
  @Output() formCallback = new EventEmitter<boolean>();
  @Output() formDataCallback = new EventEmitter<any>();
  protected fundMgrQueryForm!: FormGroup;
  protected categoryList?: { id: string; value: string }[];
  protected fundHouseList?: any[];
  protected fundMngDetails?: any[];
  protected lOneListData?: any[];
  protected filterIcon = faFilter;
  protected searchIcon = faMagnifyingGlass;
  protected saveIcon = faSave;
  protected closeIcon = faXmark;
  private initialized = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.formSetup();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      return;
    }
    if (
      (changes['sideNavTitle'] && this.sideNavTitle === '') ||
      (changes['formPayload'] && this.formPayload)
    ) {
      this.formSetup();
    }
  }

  private formSetup() {
    if (this.sideNavTitle === '') {
      this.fundMngDetails = undefined;
      this.lOneListData = undefined;
      this.categoryList = [
        { id: 'debt', value: 'Debt' },
        { id: 'fmp', value: 'FMP' },
        { id: 'equity', value: 'Equity' },
        { id: 'hybrid', value: 'Hybrid' },
        { id: 'other', value: 'Other' },
      ];
      this.fundMgrQueryForm = new FormGroup({
        fmList: new FormControl(''),
        category: new FormControl(''),
      });
      this.lOneSchemeEditingData();
    } else {
      this.categoryList = undefined;
      this.fundHouseList = undefined;
      this.fundMgrQueryForm = new FormGroup({
        fm_id: new FormControl(''),
        lone_scheme_id: new FormControl(''),
        join_date: new FormControl(''),
        close_date: new FormControl(''),
      });
      this.getFundManagerDetails();
      this.getLOneSchemeMastList();
      const payloadData = this.formPayload.payload;
      this.fundMgrQueryForm.patchValue({
        join_date: payloadData.join_date,
        close_date: payloadData.close_date,
      });
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.fundMgrQueryForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private getLOneSchemeMastList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'getLOneSchemeMastList'
      )
      .subscribe({
        next: (data: any) => {
          this.lOneListData = data['data'];
          setTimeout(() => {
            this.fundMgrQueryForm.patchValue({
              lone_scheme_id: this.formPayload.payload.l1scheme_id,
            });
          }, 200);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected lOneSchemeEditingData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'lOneSchemeEditingData'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.fundHouseList = data['data']['list_fund'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getFundManagerDetails() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.FundManagerDetails,
        'getFundManagerDetails'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.fundMngDetails = data['data'];
          setTimeout(() => {
            this.fundMgrQueryForm.patchValue({
              fm_id: this.formPayload.payload.fundmng_id,
            });
          }, 200);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected createMappingDetail() {
    const params = this.fundMgrQueryForm.value;
    params.join_date = this.formatDate(params.join_date);
    params.close_date = this.formatDate(params.close_date);

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.FundMappingDetail,
        'createMappingDetail',
        params
      )
      .pipe(first())
      .subscribe({
        next: (_) => {
          alert('Success');
          this.formCallback.emit(true);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected editFundMngDetail() {
    const requestParams: any = this.fundMgrQueryForm.value;
    requestParams['id'] = this.formPayload.payload.id;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.FundMappingDetail,
        'updateMappingDetail',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          alert(data['message']);
          this.formCallback.emit(true);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private formatDate(date: any): string {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + formattedDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  protected submitFilter() {
    this.formDataCallback.emit(this.fundMgrQueryForm.value);
  }

  protected closeNav() {
    this.formCallback.emit(false);
  }
}
