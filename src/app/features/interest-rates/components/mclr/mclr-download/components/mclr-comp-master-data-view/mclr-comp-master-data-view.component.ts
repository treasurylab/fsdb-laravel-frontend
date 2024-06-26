import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';

@Component({
  selector: 'app-mclr-comp-master-data-view',
  templateUrl: './mclr-comp-master-data-view.component.html',
  styleUrls: ['./mclr-comp-master-data-view.component.scss'],
})
export class MclrCompMasterDataViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Input({ required: true }) tenorList = new Array<any>();
  @Input({ required: true }) allCompanies = new Array<any>();
  @Output() navController = new EventEmitter<{
    action: string;
    payload?: any;
  }>();
  protected addIcon = faPlus;
  protected viewIcon = faEye;
  protected editIcon = faPenToSquare;
  protected deleteIcon = faTrash;
  protected displayedColumns: string[] = [
    'comp_name',
    'bank_name',
    'ref_no',
    'tenors',
    'action',
  ];
  protected mclrBankList = new Array<any>();
  protected compBankList: MatTableDataSource<any>;

  constructor(private apiService: ApiService) {
    this.compBankList = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getAllBankList();
    this.getCompBankList();
  }

  protected addCompMastData() {
    if (!this.sideNavObj.isOpened) {
      this.sideNavObj.toggleFormNav();
      this.navController.emit({ action: 'add' });
    }
  }

  public getCompBankList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getCompBankList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.compBankList.data = data['data'];
          this.compBankList.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected openFormNav(action: string, params: any) {
    const sideFormPayload: any = {
      id: params.id,
      referenceId: params.bank_erpref,
    };
    this.allCompanies.forEach((value: any) => {
      if (value.comp_code == params.comp_code) {
        sideFormPayload.compInfo = value;
      }
    });
    this.mclrBankList.forEach((value: any) => {
      if (value.bank_code == params.bank_code) {
        sideFormPayload.bankInfo = value;
      }
    });
    let attenders = params.mfreq_codes;
    if (attenders.indexOf(',') != -1) {
      attenders = attenders.split(',');
    }
    const selectedTenorList = new Array<any>();
    this.tenorList.forEach((value: any) => {
      if (attenders.indexOf(value.mfreq_type) != -1) {
        selectedTenorList.push(value.mfreq_type);
      }
    });
    if (selectedTenorList.length > 0) {
      sideFormPayload.tenorList = selectedTenorList;
    }
    if (!this.sideNavObj.isOpened) {
      this.sideNavObj.toggleFormNav();
    }
    this.navController.emit({ action: action, payload: sideFormPayload });
  }

  protected deleteCompBank(params: any) {
    if (confirm('Are you sure to delete this item?')) {
      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.mclr,
          'deleteCompBank',
          params
        )
        .pipe(first())
        .subscribe({
          next: (data) => {
            alert(data.data.msg);
          },
        });
    }
    this.getCompBankList();
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
}
