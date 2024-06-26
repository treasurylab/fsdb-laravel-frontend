import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-ulip-fund-houses',
  templateUrl: './add-ulip-fund-houses.component.html',
  styleUrls: ['./add-ulip-fund-houses.component.scss'],
})
export class AddUlipFundHousesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  protected sideFormTitle = '';
  protected sideFormSubTitle = '';
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected viewIcon = faEye;
  protected deleteIcon = faTrash;
  addFundhouseForm: FormGroup = new FormGroup({
    fname: new FormControl(''),
  });
  protected dataSource = new MatTableDataSource<any>();
  displayedColumn = ['no', 'name', 'Action'];
  ulipFundHouseList: any;
  selectedRecord: any;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getFundHouse();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.addFundhouseForm?.get(name) as FormControl;
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
          this.dataSource = new MatTableDataSource(this.ulipFundHouseList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected openAddRecord() {
    this.sideFormTitle = 'Add Record';
    this.sideFormSubTitle = 'Add New ULIP Scheme';
    this.addFundhouseForm.reset();
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected submitUlipScheme() {
    if (this.sideFormTitle === 'Add Record') {
      this.addFundHouse();
    } else if (this.sideFormTitle === 'Edit Record') {
      this.updateUlipFundHouse();
    }
  }

  protected addFundHouse() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'addUlipFundHouse',
        this.addFundhouseForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            console.log('Fund House Added Successfully!');
          }
          this.getFundHouse();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateUlipFundHouse() {
    const requestParams: any = this.addFundhouseForm.value;
    requestParams['id'] = this.selectedRecord.id; // Assuming id is the property name for the ID of the record

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.ulip,
        'updateUlipFundHouse',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            console.log('Ulip Fund House Updated Successfully!');
            alert('Ulip Fund House Updated Successfully!');
            this.getFundHouse();
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected goToActionPage(element: any, method: string) {
    this.selectedRecord = element;

    switch (method) {
      case 'edit':
        this.sideFormTitle = 'Edit Record';
        this.sideFormSubTitle = 'Edit ULIP Fund House Record';
        this.addFundhouseForm.patchValue({
          fname: element.bp_name,
        });
        if (!this.sideForm.isOpened) {
          this.sideForm.toggleFormNav();
        }
        break;
      case 'view':
        this.sideFormTitle = 'View Record';
        this.sideFormSubTitle = 'View ULIP Fund House Record';
        this.addFundhouseForm.patchValue(element);
        if (!this.sideForm.isOpened) {
          this.sideForm.toggleFormNav();
        }
        break;
      case 'delete':
        const confirmation = confirm(
          `Delete record with fund House : ${element.bp_name} `
        );
        if (confirmation) {
          const requestParams = {
            name: element.bp_name,
          };

          this.apiService
            .postRequestLegacy<GenericResponse<any>>(
              FeatureList.ulip,
              'deleteUlipFundHouse',
              requestParams
            )
            .pipe(first())
            .subscribe({
              next: (data: any) => {
                console.log('Asset Type Deleted');
                this.getFundHouse();
              },
              error: (err: any) => {
                console.log(err);
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
