import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-mclr-comp-mast-form',
  templateUrl: './mclr-comp-mast-form.component.html',
  styleUrl: './mclr-comp-mast-form.component.scss',
})
export class MclrCompMastFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) allCompanies = new Array<any>();
  @Input({ required: true }) tenorList = new Array<any>();
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Input({ required: true }) sideNavTitle: string = '';
  @Input() formPayload?: any;
  @Input() sideNavAction?: string;
  @Output() formDataOut = new EventEmitter<boolean>();

  protected mclrBankList = new Array<any>();
  protected mclrCompBank = new FormGroup({
    id: new FormControl(''),
    compInfo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bankInfo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    referenceID: new FormControl('', Validators.required),
    tenorList: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAllBankList();
    this.detectFormInputChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formPayload']) {
      if (this.formPayload) {
        this.mclrCompBank.patchValue({
          id: this.formPayload.id,
          compInfo: this.formPayload.compInfo,
          bankInfo: this.formPayload.bankInfo,
          referenceID: this.formPayload.referenceId,
          tenorList: this.formPayload.tenorList,
        });
      } else {
        this.mclrCompBank.reset();
      }
    }
  }

  protected detectFormInputChanges() {
    if (this.formPayload) {
      this.mclrCompBank.patchValue({
        id: this.formPayload.id,
        compInfo: this.formPayload.compInfo,
        bankInfo: this.formPayload.bankInfo,
        referenceID: this.formPayload.referenceID,
        tenorList: this.formPayload.tenorList,
      });
    }
  }

  protected getFormControllers(name: string) {
    const ctrl = this.mclrCompBank.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private getAllBankList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getAllMclrBankList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.mclrBankList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected mapCompanyToBank() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        this.sideNavAction === 'edit' ? 'updateCompBank' : 'mapCompanyToBank',
        this.mclrCompBank.value
      )
      .pipe(first())
      .subscribe({
        next: (_) => {
          this.mclrCompBank.reset();
          this.formDataOut.emit(true);
          this.sideNavObj.toggleFormNav();
        },
        error: (err: HttpErrorResponse) => {
          this.formDataOut.emit(false);
          alert(err.message);
        },
      });
  }

  protected hideForm() {
    this.sideNavObj.toggleFormNav();
  }
}
