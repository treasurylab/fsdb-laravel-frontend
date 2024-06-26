import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-gsecfbilmapping',
  templateUrl: './gsecfbilmapping.component.html',
  styleUrls: ['./gsecfbilmapping.component.scss'],
})
export class GsecfbilmappingComponent {
  private selectedSchemeId = '';
  mappedClassIdKeyword: string = '';
  mappedClassIdKeywordField = new FormControl();
  searchQuery: string = '';
  isinread: any;
  isin: any;
  classidread: any;
  gsecFormParamData: any;
  sergsecdata: any;
  navid: any = '';
  schemeClassInfo: any;
  test: string = '';
  msg: string = '';
  isTableVisible = false;
  getclassmapdata: any;
  protected searchIcon = faMagnifyingGlass;
  protected addIcon = faPlus;

  displayedColumns: string[] = ['no', 'isin'];
  displayedColumns1 = ['ci_no', 'class_id', 'isin', 'date_on'];
  showTable() {
    this.isTableVisible = true;
  }

  isTableVisible1 = false;

  showTable1() {
    this.isTableVisible1 = true;
  }

  isTableVisible2 = false;

  showTable2() {
    this.test = this.schemeClassInfo.class_id;
    this.isTableVisible2 = true;
  }
  isTableVisible3 = false;
  showTable3() {
    this.test = '';
    this.isTableVisible2 = true;
  }

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {}
  gsecFormParam = new FormGroup({
    id: new FormControl(''),
  });
  gsecFormParam1 = new FormGroup({
    isin: new FormControl(''),
  });
  UpdateClassForm = new FormGroup({
    class_id: new FormControl(''),
    class_map_isin: new FormControl(''),
  });
  editClassForm = new FormGroup({
    class_id: new FormControl(''),
    class_map_isin: new FormControl(''),
  });
  HideForm() {
    this.isTableVisible1 = false;
    this.showupdateForm = false;
    this.showEditForm = false;
  }

  protected getFormControllers(name: string) {
    const ctrl = this.gsecFormParam.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected getClassFormControllers(name: string) {
    const ctrl = this.editClassForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected updateClassFormControllers(name: string) {
    const ctrl = this.UpdateClassForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  searchGsecInfo() {
    this.gsecFormParamData = this.gsecFormParam.value;
    this.gsecFormParamData.txn = 'SrchGsec';
    this.apiService
      .getRequestLegacy(
        FeatureList.fbilmapping,
        'getFbilList',
        this.gsecFormParamData
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.sergsecdata = data['data'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  findGsecClassinfo(id?: any, code?: any) {
    this.isTableVisible1 = true;
    this.showupdateForm = false;
    this.showEditForm = false;
    this.gsecFormParamData = {
      ...this.gsecFormParamData,
      id: id,
      prod_code: code,
    };
    this.apiService
      .getRequestLegacy(
        FeatureList.fbilmapping,
        'getFbilClassId',
        this.gsecFormParamData
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.selectedSchemeId = id;
          this.schemeClassInfo = data['data'];
          this.populateUpdateForm(id, this.schemeClassInfo);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  populateUpdateForm(id?: string, classId?: string) {
    this.editClassForm.patchValue({
      class_map_isin: id,
    });
    this.UpdateClassForm.patchValue({
      class_id: classId,
      class_map_isin: id,
    });
  }

  showEditForm = false;
  showupdateForm = false;
  addClassForGSEC(action?: string, isin?: any, classid?: any) {
    this.isinread = isin;
    this.isin = this.schemeClassInfo;
    this.classidread = classid;
    switch (action) {
      case 'I':
        this.showEditForm = true;
        this.showupdateForm = false;
        this.populateUpdateForm(this.selectedSchemeId, this.isin.id);
        break;
      case 'U':
        this.showupdateForm = true;
        this.showEditForm = false;
        this.populateUpdateForm(this.isinread, this.classidread);
        break;
      default:
        break;
    }
  }

  MapCompToBank(action?: string) {
    if (action == 'I') {
      this.getclassmapdata = this.editClassForm.value;
    } else {
      this.getclassmapdata = this.UpdateClassForm.value;
      console.log(this.getclassmapdata);
    }
    this.getclassmapdata = {
      ...this.getclassmapdata,
      action: action,
      prod_code: 'GSEC',
    };
    this.apiService
      .getRequestLegacy(
        FeatureList.fbilmapping,
        'AddUpdClassForFbil',
        this.getclassmapdata
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.msg = data['msg'];
          console.log(this.msg);
          this.HideForm();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onSearchQueryChanged(value: string) {
    this.searchQuery = value;
  }

  filterTableData(data: any[]) {
    if (this.searchQuery.trim() === '') {
      return data; // Return all data if search query is empty
    }
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    return data.filter(
      (item) =>
        (item.scheme_id ?? '').toLowerCase().includes(lowerCaseQuery) ||
        (item.scheme_name ?? '').toLowerCase().includes(lowerCaseQuery) ||
        (item.class_id ?? '').toLowerCase().includes(lowerCaseQuery) ||
        (item.lastnavdt ?? '').toLowerCase().includes(lowerCaseQuery) ||
        (item.classid ?? '').toLowerCase().includes(lowerCaseQuery) ||
        (item.net_asset_value ?? '').toLowerCase().includes(lowerCaseQuery) ||
        (item.closed_flag ?? '').toLowerCase().includes(lowerCaseQuery)

      // Add more properties as needed for your search
    );
  }
}
