// Code Cleaned by FSJOSH at 15 May 2024

import {
  allmonth,
  fyyear,
  fyquarter,
  allyear,
} from './models/portoflio-management-models';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/core/services/export.service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { AddPortfolioComponent } from './components/add-portfolio/add-portfolio.component';
import { faCloudArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';

@Component({
  selector: 'app-portfolio-management',
  templateUrl: './portfolio-management.component.html',
  styleUrls: ['./portfolio-management.component.scss'],
})
export class PortfolioManagementComponent implements OnInit, AfterViewInit {
  // ViewChild declarations for paginator components and SideFormComponent
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;
  @ViewChild('paginator4') paginator4!: MatPaginator;
  @ViewChild('paginator5') paginator5!: MatPaginator;
  @ViewChild(SideFormComponent, { static: true }) sideForm!: SideFormComponent;

  // Datasources
  protected portfolioAssetConfigDatasource = new MatTableDataSource<any>();
  protected portfolioTemplateConfigDatasource = new MatTableDataSource<any>();
  protected searchDataSource = new MatTableDataSource<any>();
  protected portfolioViewDatasource = new MatTableDataSource<any>();
  protected portfolioDatasource = new MatTableDataSource<any>();
  protected listFilterDataSource = new MatTableDataSource<any>();

  // FontAwesome icons
  protected addIcon = faPlus;
  protected exportIcon = faCloudArrowDown;

  // Private variables
  private pfprodcode: any = [];

  // Protected variables
  protected allpfmonth: any = [];
  protected listFund: any = [];
  protected pfdatalist: any = [];
  protected portfoliobp: any = [];
  protected allmonthsdata: any = [];
  protected pfhsdata: any = [];

  protected pfaddbtnshow: any;
  protected selectedFile: File | null = null;
  protected searchopt: any;

  protected listFilterDataSourcedata: any = [];
  protected searchFilterValue = '';
  protected displayedColumns1 = ['#', 'code', 'des', 'action'];
  protected displayedColumns2 = ['#', 'code', 'des', 'action'];
  protected displayedColumns3 = ['#', 'month', 'symbol', 'action'];
  protected displayedColumns4 = ['#', 'fh_id', 'amfi_code', 'symbol', 'name'];
  protected displayedColumns5 = [
    '#',
    'isin_no',
    'market_value',
    'ratings',
    'prod_code',
    'isin_name',
    'action',
  ];
  protected tabs = [
    'Set Asset Type',
    'Set Template',
    'Upload Portfolio',
    'Edit Portfolio',
    'Delete Portfolio',
  ];
  protected activeTab = 'Set Asset Type';
  protected id: any;
  protected msg: any;
  protected sideFormTitle: string = '';
  protected sideFormSubTitle: string = '';
  protected currentComponent: string = '';
  protected componentData: any;

  // Data arrays
  fyquarters: fyquarter[] = [
    { id: 1, name: 'Apr - Jun' },
    { id: 2, name: 'Jul - Sep' },
    { id: 3, name: 'Oct - Dec' },
    { id: 4, name: 'Jan - Mar' },
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
  allmonths: allmonth[] = [
    { id: '01', name: 'January' },
    { id: '02', name: 'February' },
    { id: '03', name: 'March' },
    { id: '04', name: 'April' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'July' },
    { id: '08', name: 'August' },
    { id: '09', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];
  allyears: allyear[] = [
    { id: 2027, name: 2027 },
    { id: 2026, name: 2026 },
    { id: 2025, name: 2025 },
    { id: 2024, name: 2024 },
    { id: 2023, name: 2023 },
    { id: 2022, name: 2022 },
    { id: 2021, name: 2021 },
    { id: 2020, name: 2020 },
    { id: 2019, name: 2019 },
    { id: 2018, name: 2018 },
    { id: 2017, name: 2017 },
    { id: 2016, name: 2016 },
  ];

  //Form Controllers
  deletepfForm = new FormGroup({
    month: new FormControl(''),
  });

  uploadpfForm = new FormGroup({
    fundId: new FormControl(''),
    year: new FormControl(''),
    month: new FormControl(''),
  });
  editpfForm = new FormGroup({
    pfbplist: new FormControl(''),
    symbol: new FormControl(''),
    monthYear: new FormControl(''),
  });
  schsymbolForm = new FormGroup({
    schsymbol: new FormControl(''),
  });

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    //Initialization
    this.pfaddbtnshow = false;
    this.pfAssetConfig();
    this.managePortfolioMF();
    this.pftemplateconfig();
    this.getPortfolioPfMonthList();
  }

  ngAfterViewInit(): void {
    this.onTabChanged(this.tabs[0]);
  }

  protected onTabChanged(tab: string) {
    if (this.sideForm.isOpened && this.activeTab != tab) {
      this.sideForm.toggleFormNav();
    }
    this.activeTab = tab;
    setTimeout(() => {
      if (this.activeTab === this.tabs[0]) {
        this.portfolioAssetConfigDatasource.paginator = this.paginator1;
      } else if (this.activeTab === this.tabs[1]) {
        this.portfolioTemplateConfigDatasource.paginator = this.paginator2;
      } else if (this.activeTab === this.tabs[2]) {
        this.searchDataSource.paginator = this.paginator3;
      } else if (this.activeTab === this.tabs[3]) {
        this.portfolioViewDatasource.paginator = this.paginator4;
      } else if (this.activeTab === this.tabs[4]) {
        this.portfolioDatasource.paginator = this.paginator5;
      }
    }, 50);
  }

  private pfAssetConfig() {
    /**
     * Retrieves portfolio asset configuration from the API and updates the MatTableDataSource.
     * Sets the paginator for the MatTableDataSource.
     */
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getPortfolioAssetConfigList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.portfolioAssetConfigDatasource.data = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private pftemplateconfig() {
    /**
     * Retrieves portfolio template configuration from the API and updates the MatTableDataSource.
     * Sets the paginator for the MatTableDataSource.
     */
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getPortfolioTemplateConfig'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.portfolioTemplateConfigDatasource.data = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getPortfolioPfMonthList() {
    /**
     * Retrieves portfolio pf month list from the API and assigns it to allpfmonth variable.
     */
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getPortfolioPfMonthList'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.allpfmonth = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private managePortfolioMF() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getMfPortfolioData'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.listFund = data['data']['list_fund'];
            this.searchDataSource.data = data['data']['all_scheme_symbols'];
            this.searchopt = false;
            this.portfoliobp = data['data']['portfolio_bp'];
            this.allmonthsdata = data['data']['all_month_data'];
            this.pfprodcode = data['data']['pf_prod_code'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private getFundHouse(id: any) {
    const requestParam = {
      id: id,
    };
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'viewPortfolioScheme',
        requestParam
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.pfhsdata = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected deleteAssetRecord(data: any) {
    const requestParam = {
      id: data.id,
    };
    if (confirm('Are you sure to delete this item?')) {
      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.PortfolioManagement,
          'deletePortfolioAssetConfig',
          requestParam
        )
        .pipe(first())
        .subscribe({
          next: (_) => {
            alert('Asset Type Deleted');
            this.pfAssetConfig();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  protected deleteTemplateRecord(data: any) {
    if (confirm('Are you sure to delete this item?')) {
      const requestParam = {
        id: data.id,
      };

      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.PortfolioManagement,
          'deletePortfolioTemplateConfig',
          requestParam
        )
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            console.log('Template Deleted');
            this.pftemplateconfig();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  protected deletePortfolio(data: any) {
    if (confirm('Are you sure to delete this item?')) {
      const requestParam = {
        month: data.month,
        symbol: data.symbol,
      };
      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.PortfolioManagement,
          'deletePortfolioData',
          requestParam
        )
        .pipe(first())
        .subscribe({
          next: (_) => {
            alert('Portfolio Deleted');
            this.getPortfolioPfLst();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  protected portfolioDeleteData(data: any) {
    if (confirm('Are you sure to delete this item?')) {
      const requestParam = {
        id: data.id,
      };
      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.PortfolioManagement,
          'removePortfolioData',
          requestParam
        )
        .pipe(first())
        .subscribe({
          next: (_) => {
            alert('Portfolio category Deleted');
            this.portfolioDataView();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
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

  protected uploadPortfolio() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        fileObject,
        'uploadPortfolio',

        this.uploadpfForm.value
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.msg = response['msg'];
        },
      });
  }

  protected portfolioDataView() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'viewPortfolioData',
        this.editpfForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.portfolioViewDatasource = data['data']['portfolio_data'];
            this.pfaddbtnshow = true;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getPortfolioPfLst() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.PortfolioManagement,
        'getPortfolioDataByMonth',
        this.deletepfForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.portfolioDatasource.data = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  protected addAssetType() {
    //Adding a Asset (SET Asset Type)
    this.sideFormTitle = 'Add Asset Type';
    this.sideFormSubTitle = 'Adding an asset type to portfolio management';
    this.currentComponent = 'setAssetAddAssetComponent';
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }
  protected editAssetRecord(assetData?: any) {
    //Editing an Asset (SET Asset Type)
    this.componentData = assetData;
    this.sideFormTitle = 'Edit Asset Type';
    this.sideFormSubTitle = 'Editing an asset type for portfolio management';
    this.currentComponent = 'setAssetEditAssetComponent';
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected addTemplate() {
    //Adding a Template (SET Template)
    this.sideFormTitle = 'Add Template';
    this.sideFormSubTitle = 'Adding a template to portfolio management';
    this.currentComponent = 'setTemplateAddTemplateComponent';
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected editTemplate(templateData?: any) {
    //Adding a Template (SET Template)
    this.componentData = templateData;
    this.sideFormTitle = 'Edit Template';
    this.sideFormSubTitle = 'Editing a template for portfolio management';
    this.currentComponent = 'setTemplateEditTemplateComponent';
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected uploadPortflioNav() {
    //Uploading Portfolio (Upload Portfolio)
    this.sideFormTitle = 'Upload Portfolio';
    this.sideFormSubTitle = 'Upload a portfolio to manage';
    this.currentComponent = 'uploadPortfolioComponent';
    if (!this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }

  protected editPortfolio(templateData?: any) {
    //Editing a Portfolio (Edit Portfolio)
    if (!this.sideForm.isOpened) {
      this.componentData = templateData;
      this.sideFormTitle = 'Edit Portfolio';
      this.sideFormSubTitle = 'Editing a portfolio';
      this.currentComponent = 'editPortfolioComponent';
    }
    this.sideForm.toggleFormNav();
  }

  addpfinfo() {
    let alldata = {
      prodcodedata: this.pfprodcode,
      selecteddata: this.editpfForm.value,
    };
    console.log(alldata);
    this.dialog.open(AddPortfolioComponent, {
      data: alldata,
    });
  }

  exportToCsv(ratelist: any, filename: any) {
    // Create a mapping of old header names to new header names
    const headerMapping: { [key: string]: string } = {
      id: 'ID',
      isin: 'ISIN NO.',
      name: 'ISIN Name',
      market_value: 'Market Value',
      ratting1: 'Rating1',
      ratting: 'Ratings',
      prod_code: 'Prod code',
      // Add more mappings as needed
    };

    // Create a new array with customized headers
    const customizedRatelist = ratelist.map((row: { [key: string]: any }) => {
      const newRow: { [key: string]: any } = {}; // Use "any" type for newRow temporarily
      for (const key in row) {
        if (headerMapping.hasOwnProperty(key)) {
          newRow[headerMapping[key]] = row[key];
        } else {
          newRow[key] = row[key];
        }
      }
      return newRow;
    });

    // Download the CSV file
    this.exportService.downloadFile(customizedRatelist, filename);
  }

  protected onFundHouseSelected() {
    const selectedtype = this.editpfForm.get('pfbplist')!.value;
    this.getFundHouse(selectedtype);
  }

  onSelectChange(event: any) {
    this.searchopt = true;
    // Access the selected value from the event object
    const selectedValue = event;

    // Update searchDataSource with the filtered data
    this.searchDataSource.filter = selectedValue.trim();
    this.listFilterDataSourcedata = this.searchDataSource.filteredData;
    this.listFilterDataSource = this.listFilterDataSourcedata;
    // Reset the search filter when selecting a list
    this.searchFilterValue = '';
  }

  protected applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portfolioAssetConfigDatasource.filter = filterValue
      .trim()
      .toLowerCase();
  }
  protected applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portfolioTemplateConfigDatasource.filter = filterValue
      .trim()
      .toLowerCase();
  }
  protected applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portfolioDatasource.filter = filterValue.trim().toLowerCase();
  }
  protected applyFilter4(event: Event) {
    // console.log(this.searchopt);
    if (this.searchopt) {
      const filterValue = (
        event.target as HTMLInputElement
      ).value.toLowerCase();
      // Apply search filter to the searchDataSource
      this.listFilterDataSourcedata.filter = filterValue.trim().toLowerCase();
    } else {
      const filterValue = (
        event.target as HTMLInputElement
      ).value.toLowerCase();
      // If not in list selection mode, reset the filter
      this.searchDataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  protected applyFilter5(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.portfolioViewDatasource.filter = filterValue.trim().toLowerCase();
  }

  protected getUploadPortfolioControllers(name: string) {
    const ctrl = this.uploadpfForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getDeletePortfolioControllers(name: string) {
    const ctrl = this.deletepfForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected getEditPortfolioControllers(name: string) {
    const ctrl = this.editpfForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected closeSideForm() {
    if (this.sideForm.isOpened) {
      this.sideForm.toggleFormNav();
    }
  }
}
