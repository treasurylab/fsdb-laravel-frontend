import { EditMonthlyAumComponent } from './components/edit-monthly-aum/edit-monthly-aum.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { AddMonthlyAumComponent } from './components/add-monthly-aum/add-monthly-aum.component';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { EditFundHouseComponent } from './components/edit-fund-house/edit-fund-house.component';
import {
  faEraser,
  faEye,
  faFilter,
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

export interface fyyear {
  id: any;
  name: string;
}
export interface fyyear1 {
  id: any;
  name: string;
}

export interface fyquarter {
  id: any;
  name: string;
}
export interface allmonth {
  id: any;
  name: string;
}

@Component({
  selector: 'app-fund-house',
  templateUrl: './fund-house.component.html',
  styleUrls: ['./fund-house.component.scss'],
})
export class FundHouseComponent implements OnInit {
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;
  @ViewChild(SideFormComponent) sideFormObj!: SideFormComponent;
  @ViewChild('addEditFundHouseSchemeView')
  addEditFundHouseSchemeView?: EditFundHouseComponent;
  protected sideFormTitle = '';
  protected sideFormSubTitle = '';
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  listbp: any = [];
  montlyaum: any = [];
  params: any;
  aumFormParams: any;
  aumMonthParams: any;
  newfundFormParams: any;
  fhParam: any = [];
  aumParam: any = [];
  pullDataAum: any = [];
  avaFundHouse: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();
  selectedFile: File | null = null;
  pullbtnimg = false;
  msg: any;

  protected tabs = [
    'Edit Fund House',
    'AUM Upload',
    'Monthly Fund House AAUM',
    'Pull/Create Fund House',
  ];
  protected activeTab = 'Edit Fund House';
  protected filterIcon = faFilter;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected addIcon = faPlus;
  protected editIcon = faPenToSquare;
  protected viewIcon = faEye;
  protected deleteIcon = faTrash;

  protected onTabChanged(tab: string) {
    if (this.sideForm.isOpened && this.activeTab != tab) {
      this.sideForm.toggleFormNav();
    }
    this.activeTab = tab;
  }

  protected onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedFile = files.item(0);
    } else {
      this.selectedFile = null;
    }
  }

  protected uploadAumFormControllers(name: string) {
    const ctrl = this.AumParamForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getFormControllers(name: string) {
    const ctrl = this.addFundhouseForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected monthlyAumControllers(name: string) {
    const ctrl = this.monthlyAumForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  displayedColumns2: string[] = ['srno', 'id', 'name', 'aum_amount'];

  fyyears: fyyear[] = [
    { id: 2025, name: "Apr'2024 - Mar'2025" },
    { id: 2024, name: "Apr'2023 - Mar'2024" },
    { id: 2023, name: "Apr'2022 - Mar'2023" },
    { id: 2022, name: "Apr'2021 - Mar'2022" },
    { id: 2021, name: "Apr'2020 - Mar'2021" },
    { id: 2020, name: "Apr'2019 - Mar'2020" },
    { id: 2019, name: "Apr'2018 - Mar'2019" },
    { id: 2018, name: "Apr'2017 - Mar'2018" },
    { id: 2017, name: "Apr'2016 - Mar'2017" },
  ];
  fyyear1: fyyear1[] = [
    { id: 2025, name: '2025' },
    { id: 2024, name: '2024' },
    { id: 2023, name: '2023' },
    { id: 2022, name: '2022' },
    { id: 2021, name: '2021' },
    { id: 2020, name: '2020' },
    { id: 2019, name: '2019' },
    { id: 2018, name: '2018' },
    { id: 2017, name: '2017' },
  ];

  fyquarters: fyquarter[] = [
    { id: 1, name: 'Apr - Jun' },
    { id: 2, name: 'Jul - Sep' },
    { id: 3, name: 'Oct - Dec' },
    { id: 4, name: 'Jan - Mar' },
  ];
  allmonths: allmonth[] = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' },
  ];

  AumParamForm: FormGroup = new FormGroup({
    year: new FormControl(''),
    quarter: new FormControl(''),
    uploadfile: new FormControl(''),
  });

  monthlyAumForm: FormGroup = new FormGroup({
    finYear: new FormControl(''),
    month: new FormControl(''),
  });

  addFundhouseForm: FormGroup = new FormGroup({
    fname: new FormControl(''),
  });

  //   fundhinfoForm = new FormGroup({
  //     symbol: new FormControl(''),
  //     name: new FormControl(''),
  //     sname: new FormControl(''),
  //     bpType: new FormControl(''),
  //   });

  ngOnInit() {
    // this.pullbtnimg = false;
    // this.fundHouseProductList();
  }

  //   // clean fun
  //   fundHouseProductList() {
  //     this.params = 'FUNDHSG';
  //     const requestParams = {
  //       id: this.params,
  //     };
  //     this.apiService
  //       .postRequest<GenericResponse<any>>(
  //         FeatureList.mfFundhouse,
  //         'fundHouseProductList',
  //         requestParams
  //       )
  //       .pipe(first())
  //       .subscribe({
  //         next: (data: any) => {
  //           if (data != null) {
  //             this.listbp = data['data'];
  //             this.dataSource1 = new MatTableDataSource(this.listbp);
  //             this.dataSource1!.paginator = this.paginator1;
  //           }
  //         },
  //         error: (err: any) => {
  //           console.log(err);
  //         },
  //       });
  //   }

  // clean fun
  getMonthlyAum() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'getMonthlyAum',
        this.monthlyAumForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.montlyaum = data['data'];
            this.dataSource2 = new MatTableDataSource(this.montlyaum);
            this.dataSource2!.paginator = this.paginator2;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  // clean fun
  addFundHouse() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'addFundHouse',
        this.addFundhouseForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            console.log('Fund House Added Successfully!');
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  pullData(str: any) {
    this.pullbtnimg = true;
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'pullFundHouse',
        str
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.pullDataAum = data['message'];
            this.pullbtnimg = false;
            this.gdbp();
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  // clean fun
  gdbp() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'getBpData'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.avaFundHouse = data['data']['gTxt'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  //   protected editfundhinfo(fundhouseData?: any) {
  //     this.dialog.open(EditFundHouseComponent, {
  //       data: fundhouseData,
  //     });
  //   }

  uploadfundamu() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        fileObject,
        'uploadFundAum',

        this.AumParamForm.value
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.msg = response['msg'];
        },
      });
  }

  add_aum_monthly() {
    this.dialog.open(AddMonthlyAumComponent, {});
  }

  protected editMonthlyAum(aumData?: any) {
    this.dialog.open(EditMonthlyAumComponent, {
      data: aumData,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  //   protected closeSideForm() {
  //     if (this.sideForm.isOpened) {
  //       this.sideForm.toggleFormNav();
  //     }
  //   }

  //   protected fundHouseEntryController(params: {
  //     action: string;
  //     payload?: { id: string; name: string; symbol: string; sname: string };
  //   }) {
  //     if (this.activeTab === this.tabs[1]) {
  //       if (params.action === 'edit') {
  //         this.sideNavTitle = 'Edit Fund House';
  //       } else {
  //         return;
  //       }
  //       this.sideFormPayload = params;
  //     }
  //     if (!this.sideFormObj.isOpened) {
  //       this.sideFormObj.toggleFormNav();
  //     }
  //     return;
  //   }
  // }

  protected sideNavTitle: string = '';
  protected sideFormPayload?: any;

  protected lastFilterForm?: any;

  // Add/Edit Fund House
  protected addEditFundHouseFormController(params: {
    action: string;
    payload: object | undefined;
  }) {
    if (this.activeTab === this.tabs[0]) {
      if (params.action === 'add') {
        this.sideNavTitle = 'Add Fund House Data';
      } else if (params.action === 'edit') {
        this.sideNavTitle = 'Edit Fund House Data';
      } else {
        return;
      }
      this.sideFormPayload = params;
    }
    if (!this.sideFormObj.isOpened) {
      this.sideFormObj.toggleFormNav();
    }
    return;
  }

  protected addEditFundHouseFormCallback() {
    this.addEditFundHouseSchemeView?.fundHouseProductList();
  }
}
