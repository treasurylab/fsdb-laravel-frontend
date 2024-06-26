import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { EditLtwoSchemeComponent } from './components/edit-ltwo-scheme/edit-ltwo-scheme.component';
import { UpdateSymbolComponent } from './components/update-symbol/update-symbol.component';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import {
  faEraser,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

export interface fyyear {
  id: any;
  name: string;
}

export interface fyquarter {
  id: any;
  name: string;
}

@Component({
  selector: 'app-ltwo-scheme',
  templateUrl: './ltwo-scheme.component.html',
  styleUrls: ['./ltwo-scheme.component.scss'],
})
export class LtwoSchemeComponent implements OnInit {
  @ViewChild(SideFormComponent) sideFormObj!: SideFormComponent;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;

  protected tabs = [
    'Available Scheme',
    'Edit Scheme',
    'Upload AUM of Schemes',
    'Update Closure Date of Scheme',
    'Scheme Reports',
    'Update Link Symbols',
  ];

  protected activeTab = 'Available Scheme';
  protected sideNavTitle: string = '';
  protected sideFormPayload?: any;
  protected filterIcon = faFilter;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;

  protected onTabChanged(tab: string) {
    if (this.sideFormObj.isOpened && this.activeTab != tab) {
      this.sideFormObj.toggleFormNav();
    }
    this.activeTab = tab;
  }

  protected getLatestSchemeFormControllers(name: string) {
    const ctrl = this.latestScheme.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected getRecentSchemeFormControllers(name: string) {
    const ctrl = this.latestScheme.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected editSchemeFormControllers(name: string) {
    const ctrl = this.editSchemeForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected uploadAumFormControllers(name: string) {
    const ctrl = this.AumParamForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected schemReportFormControllers(name: string) {
    const ctrl = this.schemeReport.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  fmList: any[] | undefined;
  params: any;
  rptparams: any;
  listsebi: any;
  fundmngrdetails2: any[] | undefined;
  get_l1listdata: any;
  mappedClassIdKeyword: string = '';
  mappedClassIdKeywordField = new FormControl();
  searchQuery: string = '';
  amfiread: any;
  amfiid: any;
  classidread: any;
  gsecFormParamData1: any;
  isActiveButton: any;
  test: string = '';
  isTableVisible = false;
  getclassmapdata: any;
  updclosuredata: any;
  dbService: any;
  dbservice: any;
  reportList: { id: string; value: string }[] | undefined;
  dataSource11: any;
  sebiParam: any;
  pullbtnimg: boolean | undefined;
  pullDataAum: any;
  isTableVisible3: boolean | undefined;
  aumFormParams: any;
  selectedFile: any;
  data: unknown[] | undefined;
  uploadmsg: any;
  selectedOption: string = '';
  fromDate: any;
  keyDate: any;
  toDate: any;
  endDate: any;
  fromDateD: any;
  exportmclr: boolean = false;
  miborrateList: any = [];
  miborformdata: any = [];
  cgrp: any;
  schemefound: any;
  navid: any = '';
  id: any = '';
  classidfound: any;
  dataSource = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource4 = new MatTableDataSource<any>();
  dataSource5 = new MatTableDataSource<any>();
  dataSource1 = new MatTableDataSource<any>();

  latestScheme = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
  });

  recentScheme = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
  });

  displayedColumnDW4 = [
    'amfi',
    'isin',
    'bpid',
    'amficat',
    'schemecat',
    `symbol`,
    `link symbol`,
    `closing`,
    `created`,
    `scheme`,
  ];

  displayedColumns: string[] = [
    'srno',
    'amfiid',
    'sebi',
    'isin',
    'scheme',
    'symbol',
  ];

  displayedColumns1: string[] = [
    'srno',
    'amfiid',
    'isin',
    'bpid',
    'amficatg',
    'achemecatg',
    'symbol',
    'linksymbol',
    'closing',
    'closingdt',
    'name',
  ];

  displayedColumns2: string[] = [
    'srno',
    'amfiid',
    'isin',
    'link symbol',
    'sebi',
    'symbol',
    'scheme',
  ];

  displayedColumns6: string[] = [
    'srno',
    'amfiid',
    'isin',
    'bpid',
    'amficatg',
    'schemecatg',
    'symbol',
    'linksymbol',
    'closing',
    'launch Date',
    'close Date',
    'scheme name',
  ];

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

  fyquarters: fyquarter[] = [
    { id: 1, name: 'Apr - Jun' },
    { id: 2, name: 'Jul - Sep' },
    { id: 3, name: 'Oct - Dec' },
    { id: 4, name: 'Jan - Mar' },
  ];
  listbp: any;
  navSchemeData: any;
  msg: any;
  allsebilist: any;

  showTable() {
    this.isTableVisible = true;
  }

  showTable3() {
    this.isTableVisible3 = true;
  }

  isTableVisible1 = false;

  constructor(
    private apiService: ApiService,
    protected dialog: MatDialog,
    private datePipe: DatePipe // private dbService: DbService
  ) {}

  ngOnInit(): void {
    this.fundHouseProductList();
    this.lTwoSchemeEditingData();
    this.isActiveButton = 1;
    this.reportList = [
      { id: 'SCH_BPID', value: 'Scheme List by AMC/Fund House' },
      { id: 'SCH_SEBICAT', value: 'Scheme List by Sebi Category' },
      { id: 'SCH_MISSYMB', value: 'Missing Symbol' },
      { id: 'SCH_NOLINKDYMB', value: 'Missing Link Symbol' },
      { id: 'SCH_MISSSEBICAT', value: 'Missing Sebi Category' },
      { id: 'SEC_MISSCLOSEDT', value: 'Missing Closure Date' },
      { id: 'SCH_MISSLUCHDT', value: 'Missing Launch Date' },
      { id: 'SCH_MISSISIN', value: 'Missing ISIN' },
      { id: 'SCH_EXP', value: 'Expired List Schemes' },
      { id: 'SCH_CLSFLG', value: 'Close Flag Not Mapped' },
    ];
  }

  AumParamForm: FormGroup = new FormGroup({
    year: new FormControl(''),
    quarter: new FormControl(''),
    uploadfile: new FormControl(''),
  });

  schemeReport = new FormGroup({
    fh: new FormControl(''),
    sc: new FormControl(''),
    rpt: new FormControl(''),
  });

  editSchemeForm = new FormGroup({
    id: new FormControl(''),
  });

  gsecFormParam1 = new FormGroup({
    amfiid: new FormControl(''),
  });

  UpdateClassForm = new FormGroup({
    class_id: new FormControl(''),
    class_scheme_id: new FormControl(''),
  });

  editClassForm = new FormGroup({
    class_id: new FormControl(''),
    class_scheme_id: new FormControl(''),
  });

  HideForm() {
    this.isTableVisible1 = false;
  }

  // ----------------------------------------- Updated Function------------------------------------------------------------------------

  // clean fun
  fundHouseProductList() {
    this.params = 'FUNDHSG';
    const requestParams = {
      id: this.params,
    };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.mfFundhouse,
        'fundHouseProductList',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.listbp = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  Updclosure() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'updateClosure'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.updclosuredata = data['data'];
            this.dataSource5 = new MatTableDataSource(this.updclosuredata);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  schemeSrchReoprt() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'schemeSearchReport',
        this.schemeReport.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.fundmngrdetails2 = data['data'];
            this.dataSource11 = new MatTableDataSource(this.fundmngrdetails2);
            this.dataSource11!.paginator = this.paginator3;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  pullScheme() {
    this.pullbtnimg = true;

    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'pullScheme'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.pullDataAum = data['data'];
            this.pullbtnimg = false;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  setActiveButton(buttonNumber: number) {
    if (this.isActiveButton === buttonNumber) {
      this.isActiveButton = null;
    } else {
      this.isActiveButton = buttonNumber;
    }
  }

  public NavScheme() {
    // console.log(this.gsecFormParam.value);

    const requestParams = {
      id: this.editSchemeForm.get('id')?.value,
      txn: 'Srch',
    };

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'getNavScheme',
        requestParams
      )
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.schemefound = data['data'];
          this.navSchemeData = new MatTableDataSource(this.schemefound);
        },
      });
  }

  getNewestSchemes() {
    this.miborformdata = this.latestScheme.value;
    if (
      !isNaN(Date.parse(this.miborformdata.sdate)) ||
      !isNaN(Date.parse(this.miborformdata.fromdate))
    ) {
      this.miborformdata.fromdate = new Date(this.miborformdata.fromdate);
      this.miborformdata.fromdate = this.datePipe.transform(
        this.miborformdata.fromdate,
        'yyyy-MM-dd'
      );
      this.miborformdata.todate = new Date(this.miborformdata.todate);
      this.miborformdata.todate = this.datePipe.transform(
        this.miborformdata.todate,
        'yyyy-MM-dd'
      );
    } else {
      console.log('Date not valid');
    }
    this.miborformdata.r = 'c';

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'getNewestSchemes',
        this.miborformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateList = data['data'];
          this.exportmclr = true;
          this.dataSource2.data = this.miborrateList;
          this.dataSource2.paginator = this.paginator1;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  clearForm() {
    this.latestScheme.reset();
  }

  getRecentSchemes() {
    this.miborformdata = this.latestScheme.value;
    if (
      !isNaN(Date.parse(this.miborformdata.sdate)) ||
      !isNaN(Date.parse(this.miborformdata.fromdate))
    ) {
      this.miborformdata.fromdate = new Date(this.miborformdata.fromdate);
      this.miborformdata.fromdate = this.datePipe.transform(
        this.miborformdata.fromdate,
        'yyyy-MM-dd'
      );
      this.miborformdata.todate = new Date(this.miborformdata.todate);
      this.miborformdata.todate = this.datePipe.transform(
        this.miborformdata.todate,
        'yyyy-MM-dd'
      );
    } else {
      console.log('Date not valid');
    }
    this.miborformdata.r = 'm';

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'getNewestSchemes',
        this.miborformdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.miborrateList = data['data'];
          this.exportmclr = true;
          this.dataSource4 = new MatTableDataSource(this.miborrateList);
          this.dataSource4!.paginator = this.paginator2;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedFile = files.item(0);
    } else {
      this.selectedFile = null;
    }
  }

  uploadschemeaum() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        fileObject,
        'uploadSchemeAum',

        this.AumParamForm.value
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.msg = response['msg'];
        },
      });
  }

  lTwoSchemeEditingData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.LTwoScheme,
        'lTwoSchemeEditingData'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.allsebilist = data['data']['all_sebi_list'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  // ----------------------------------------------Updated Function-------------------------------------------------------------------

  // --------------------------------MODALS----------------------------------

  protected editLtwoSchemeModal(ltwoSchemeData?: any) {
    this.dialog.open(EditLtwoSchemeComponent, {
      data: ltwoSchemeData,
    });
  }
  protected updateSymbolModal(symbolData?: any) {
    this.dialog.open(UpdateSymbolComponent, {
      data: symbolData,
    });
  }

  // --------------------------------MODALS----------------------------------

  schemeinfo(id?: any) {
    if (id) {
      this.sebiParam = id;
      let alldata = { id: this.sebiParam };
    } else {
      console.log('Invalid ID');
    }
  }
}
