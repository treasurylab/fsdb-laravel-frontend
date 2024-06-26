import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { FormGroup, FormControl } from '@angular/forms';
import { GenericResponse } from 'src/app/shared/models/generic-response';

@Component({
  selector: 'app-sebi-catg',
  templateUrl: './sebi-catg.component.html',
  styleUrls: ['./sebi-catg.component.scss'],
})
export class SebiCatgComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  protected sideFormTitle = '';
  protected sideFormSubTitle = '';
  protected dataSource = new MatTableDataSource<any>();
  protected listsebi: any = [];
  protected sebiParam: any;
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected viewIcon = faEye;
  protected deleteIcon = faTrash;
  protected sebiCategories: any[] = [];

  protected allsebiday = [
    { id: '1D', name: '1 Day' },
    { id: '1W', name: '1 Week' },
    { id: '1M', name: '1 Month' },
    { id: '6M', name: '6 Month' },
    { id: '1Y', name: '1 Year' },
  ];

  protected sebiInfoForm = new FormGroup({
    sebi_catg_code: new FormControl(''),
    catg_code: new FormControl(''),
    catg_name: new FormControl(''),
    catg_characteristics: new FormControl(''),
    catg_desc: new FormControl(''),
    catg_horizon_id: new FormControl(''),
    id: new FormControl(''),
  });

  protected displayedColumns = [
    'srno',
    'Group',
    'Category',
    'Horizon',
    'Action',
  ];

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getSebiCategories();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.sebiInfoForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getSebiCategories() {
    this.apiService
      .getRequestLegacy(FeatureList.mfSebiCatg, 'getSebiCategories')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.listsebi = data['data']['sebi_list'];
            this.sebiCategories = data['data']['sebi_catg_grp_list'];
            this.dataSource = new MatTableDataSource(this.listsebi);
            this.dataSource!.paginator = this.paginator;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected openAddRecord() {
    if (this.sideFormTitle !== 'Add Record') {
      this.sideFormTitle = 'Add Record';
      this.sideFormSubTitle = 'Add New SEBI Scheme';
      this.sebiInfoForm.reset();
      if (this.sebiInfoForm.disabled) {
        this.sebiInfoForm.enable();
      }
    }
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected submitSebiScheme() {
    if (this.sideFormTitle === 'Add Record') {
      this.editSebiInfo();
    } else if (this.sideFormTitle === 'Edit Record') {
      this.updateSebiInfo();
    }
  }

  protected goToActionPage(element: any, method: string) {
    switch (method) {
      case 'edit':
      case 'view':
        if (method === 'edit') {
          this.sideFormTitle = 'Edit Record';
          this.sideFormSubTitle = 'Edit SEBI Category Record';
          if (this.sebiInfoForm.disabled) {
            this.sebiInfoForm.enable();
          }
        } else {
          this.sideFormTitle = 'View Record';
          this.sideFormSubTitle = 'View SEBI Category Record';
          if (this.sebiInfoForm.enabled) {
            this.sebiInfoForm.disable();
          }
        }
        const groupName = element.gname;
        let groupCode = '';
        for (let i = 0; i < this.sebiCategories.length; i++) {
          if (this.sebiCategories[i].name === groupName) {
            groupCode = this.sebiCategories[i].code;
            break;
          }
        }
        setTimeout(() => {
          this.sebiInfoForm.patchValue({
            sebi_catg_code: groupCode,
            catg_code: element.code,
            catg_name: element.tname,
            catg_characteristics: element.cchar,
            catg_desc: element.cdesc,
            catg_horizon_id: element.chorizon,
            id: element.id,
          });
        }, 100);
        if (!this.sideForm.isOpened) {
          this.sideForm.toggleFormNav();
        }
        break;
      case 'delete':
        const confirmation = confirm(
          `Delete record with Sebi Category : ${element.name} and name : ${element.sname}`
        );
        if (confirmation) {
          const requestParams = {
            id: element.id,
          };

          this.apiService
            .postRequestLegacy<GenericResponse<any>>(
              FeatureList.mfSebiCatg,
              'deleteSebiRecord',
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

  protected editSebiInfo() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfSebiCatg,
        'insertOrUpdateSebiInfo',
        this.sebiInfoForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('New Sebi category Added');
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected updateSebiInfo() {
    const requestParams = {
      sebi_catg_code: this.sebiInfoForm.value.sebi_catg_code,
      catg_code: this.sebiInfoForm.value.catg_code,
      catg_name: this.sebiInfoForm.value.catg_name,
      catg_characteristics: this.sebiInfoForm.value.catg_characteristics,
      catg_desc: this.sebiInfoForm.value.catg_desc,
      catg_horizon_id: this.sebiInfoForm.value.catg_horizon_id,
      id: this.sebiInfoForm.value.id,
    };

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfSebiCatg,
        'insertOrUpdateSebiInfo',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('New Sebi category Added');
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  // protected editSebiInfo(sebiData?: any) {
  //   this.dialog.open(EditSebiCatgComponent, {
  //     data: sebiData,
  //   });
  // }

  // protected addSebiInfo() {
  //   this.dialog.open(AddSebiCatgComponent, {});
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected closeSideForm() {
    if (this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }
}
