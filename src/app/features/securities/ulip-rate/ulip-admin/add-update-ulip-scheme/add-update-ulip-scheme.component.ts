import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { filter, first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { EditUlipSchemeComponent } from './edit-ulip-scheme/edit-ulip-scheme.component';
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { EditRateEntryComponent } from 'src/app/features/interest-rates/components/mclr-admin/mclr-rate-entry/components/edit-rate-entry/edit-rate-entry.component';

@Component({
  selector: 'app-add-update-ulip-scheme',
  templateUrl: './add-update-ulip-scheme.component.html',
  styleUrls: ['./add-update-ulip-scheme.component.scss'],
})
export class AddUpdateUlipSchemeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  protected sideFormTitle = '';
  protected sideFormSubTitle = '';
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected viewIcon = faEye;
  protected deleteIcon = faTrash;
  protected selectedFile?: File | null;
  addSchemeForm: FormGroup = new FormGroup({
    fhlist: new FormControl(''),
    sname: new FormControl(''),
    sfin: new FormControl(''),
    rstatus: new FormControl(''),
    sec_id: new FormControl(''),
  });
  protected dataSource = new MatTableDataSource<any>();
  displayedColumn = ['no', 'name', 'sname', 'scode', 'Action'];
  ulipFundHouseList: any;
  ulipSchemeList: any;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getUlipSchemes();
    this.getFundHouse();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.addSchemeForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  getFundHouse() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'getUlipFundHouses'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.ulipFundHouseList = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getUlipSchemes() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'getUlipSchemes'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.ulipSchemeList = data['data'];
          this.dataSource = new MatTableDataSource(this.ulipSchemeList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected openAddRecord() {
    if (this.sideFormTitle !== 'Add Record') {
      this.sideFormTitle = 'Add Record';
      this.sideFormSubTitle = 'Add New ULIP Scheme';
      this.addSchemeForm.reset();
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

  protected submitUlipScheme() {
    if (this.sideFormTitle === 'Add Record') {
      this.addNewUlipScheme();
    } else if (this.sideFormTitle === 'Edit Record') {
      this.updateUlipScheme();
    }
  }

  protected addNewUlipScheme() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'addUlipScheme',
        this.addSchemeForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            console.log('Ulip Scheme Added Successfully!');
            alert('Ulip Scheme Added Successfully!');
          }
          this.getUlipSchemes();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected updateUlipScheme() {
    const updatedScheme = {
      fhname: this.addSchemeForm.value.fhlist,
      isin: this.addSchemeForm.value.sfin,
      sec_id: this.addSchemeForm.value.sec_id,
      sname: this.addSchemeForm.value.sname,
      rstatus: this.addSchemeForm.value.rstatus,
    };

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'updateUlipScheme',
        updatedScheme
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            console.log('Ulip Scheme Updated Successfully!');
            alert('Ulip Scheme Updated Successfully!');
          }
          this.getUlipSchemes();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected goToActionPage(element: any, method: string) {
    console.log(element);
    switch (method) {
      case 'edit':
        this.sideFormTitle = 'Edit Record';
        this.sideFormSubTitle = 'Edit ULIP Scheme Record';
        this.addSchemeForm.patchValue({
          fhlist: element.bp_id,
          sname: element.sname,
          sfin: element.scode,
          status: element.rstatus,
          sec_id: element.sec_id,
        });
        if (!this.sideForm.isOpened) {
          this.sideForm.toggleFormNav();
        }
        break;
      case 'view':
        this.sideFormTitle = 'View Record';
        this.sideFormSubTitle = 'View ULIP Scheme Record';
        this.addSchemeForm.patchValue(element);
        this.addSchemeForm.disable();
        if (!this.sideForm.isOpened) {
          this.sideForm.toggleFormNav();
        }
        break;
      case 'delete':
        const confirmation = confirm(
          `Delete record with fund House : ${element.name} and name : ${element.sname}`
        );
        if (confirmation) {
          const requestParams = {
            id: element.sec_id,
          };

          this.apiService
            .postRequestLegacy<GenericResponse<any>>(
              FeatureList.ulip,
              'deleteUlipScheme',
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
        // do nothing...
        break;
    }
  }

  protected closeSideForm() {
    if (this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }
}
