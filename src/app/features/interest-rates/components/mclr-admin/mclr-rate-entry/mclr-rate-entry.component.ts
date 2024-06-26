import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';

import { EditRateEntryComponent } from './components/edit-rate-entry/edit-rate-entry.component';
import { ViewRateEntryComponent } from './components/view-rate-entry/view-rate-entry.component';
import { AddRateEntryComponent } from './components/add-rate-entry/add-rate-entry.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';

@Component({
  selector: 'app-mclr-rate-entry',
  templateUrl: './mclr-rate-entry.component.html',
  styleUrls: ['./mclr-rate-entry.component.scss'],
})
export class MclrRateEntryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  protected sideFormTitle = '';
  protected sideFormSubTitle = '';
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected viewIcon = faEye;
  protected deleteIcon = faTrash;
  protected selectedFile?: File | null;
  protected mclrRateForm = new FormGroup({
    bankCode: new FormControl(''),
    effectiveDate: new FormControl(''),
    mclrUrl: new FormControl(''),
    overnight: new FormControl(''),
    oneMonth: new FormControl(''),
    threeMonth: new FormControl(''),
    sixMonth: new FormControl(''),
    oneYear: new FormControl(''),
    twoYear: new FormControl(''),
    threeYear: new FormControl(''),
    fiveYear: new FormControl(''),
  });
  protected dataSource = new MatTableDataSource<any>();
  protected displayedColumns = [
    'No',
    'Bank Code',
    'Bank Name',
    'Bank Group',
    'Changed By',
    'Changed On',
    'Effective Date',
    'Action',
  ];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getMclrMasterTable();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.mclrRateForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private getMclrMasterTable() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getAllMclrMasterBanks'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dataSource = new MatTableDataSource(data['data']);
          this.dataSource!.paginator = this.paginator;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  protected openAddRecord() {
    if (this.sideFormTitle !== 'Add Record') {
      this.sideFormTitle = 'Add Record';
      this.sideFormSubTitle = 'Add a new MCLR Master Record';
      this.mclrRateForm.reset();
    }
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedFile = files.item(0);
    } else {
      this.selectedFile = null;
    }
  }

  protected create() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.mclr,
        fileObject,
        'createMclrMastEntry',
        this.mclrRateForm.value
      )
      .subscribe({
        next: (_) => {
          alert('Created successfully.');
          this.getMclrMasterTable();
        },
      });
  }

  protected edit() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.mclr,
        fileObject,
        'updateMclrMastEntry',
        this.mclrRateForm.value
      )
      .subscribe({
        next: (response: any) => {
          alert(response['msg']);
          if (response['status'] !== 'error') {
            alert('Updated successfully.');
            this.sideForm.toggleFormNav();
            this.getMclrMasterTable();
          }
        },
      });
  }

  protected goToActionPage(bank: any, method: string) {
    switch (method) {
      case 'edit':
      case 'view':
        this.dialog
          .open(EditRateEntryComponent, {
            data: {
              bank: bank,
              action: method,
            },
          })
          .afterClosed()
          .subscribe({
            next: (data: { data: any; editable: boolean }) => {
              if (data.editable) {
                this.mclrRateForm.patchValue(data.data);
                this.sideFormTitle = 'Edit Record';
                this.sideFormSubTitle = 'Edit MCLR Master Record';
              } else {
                this.mclrRateForm.patchValue(data.data);
                this.mclrRateForm.disable();
                this.sideFormTitle = 'View Record';
                this.sideFormSubTitle = 'View MCLR Master Record';
              }
              if (!this.sideForm.isOpened) {
                this.sideForm.toggleFormNav();
              }
            },
          });
        break;
      case 'delete':
        const confirmation = confirm(
          `Delete record with bank code ${bank.bank_code} and effective date ${bank.effective_date}`
        );
        if (confirmation) {
          const requestParams = {
            bank_code: bank.bank_code,
            effective_date: bank.effective_date,
          };

          this.apiService
            .postRequestLegacy<GenericResponse<any>>(
              FeatureList.mclr,
              'deleteMclrMastEntry',
              requestParams
            )
            .subscribe({
              next: (response) => {
                alert(response.message);
                window.location.reload();
              },
            });
        }
        break;
      default:
        //do nothing...
        break;
    }
  }

  protected closeSideForm() {
    if (this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }
}
