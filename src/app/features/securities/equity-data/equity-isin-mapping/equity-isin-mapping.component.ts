import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-equity-isin-mapping',
  templateUrl: './equity-isin-mapping.component.html',
  styleUrls: ['./equity-isin-mapping.component.scss'],
})
export class EquityIsinMappingComponent {
  currentStep = 1;

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private selectedSchemeId = '';
  protected mappedClassIdKeyword: string = '';
  protected mappedClassIdKeywordField = new FormControl();
  protected searchQuery: string = '';
  protected isinread: any;
  protected isin: any;
  protected classidread: any;
  protected gsecData = new Array<any>();
  protected schemeClassInfo = new Array<any>();
  protected navid: any = '';
  protected test: string = '';

  protected getclassmapdata: any;
  protected searchIcon = faMagnifyingGlass;
  protected addIcon = faPlus;

  protected displayedColumns: string[] = ['no', 'isin', 'bpid', 'issuer_name'];
  protected displayedColumns1 = ['ci_no', 'class_id', 'isin', 'date_on'];

  protected gsecFormParam = new FormGroup({
    id: new FormControl(''),
  });

  protected classForm = new FormGroup({
    class_id: new FormControl(''),
    class_map_isin: new FormControl(''),
  });
  protected editClassForm = new FormGroup({
    class_id: new FormControl(''),
    class_map_isin: new FormControl(''),
  });

  constructor(private apiService: ApiService) {}

  protected hideForm() {
    this.showEditForm = false;
  }

  protected getFormControllers(name: string) {
    const ctrl = this.gsecFormParam.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }
  protected getClassFormControllers(name: string) {
    const ctrl = this.classForm.get(name) as FormControl;

    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected searchGSecInfo() {
    const gsecFormParamData: any = this.gsecFormParam.value;
    gsecFormParamData.txn = 'Srch';
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getIsinData', gsecFormParamData)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.gsecData = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected findMtmSchemeInfo(id?: any) {
    this.apiService
      .postRequestLegacy(FeatureList.equity, 'getIsinClassIdData', {
        secId: id,
      })
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          if (data != null) {
            this.selectedSchemeId = id;
            this.schemeClassInfo = data['data'];
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  private populateUpdateForm(id?: string, classId?: string) {
    this.classForm.patchValue({
      class_id: classId,
      class_map_isin: id,
    });
  }

  protected showEditForm = false;
  protected addClassForMtm(action?: string, isin?: any, classid?: any) {
    this.isinread = isin;
    this.classidread = classid;
    this.showEditForm = true;
    switch (action) {
      case 'I':
        this.populateUpdateForm(this.selectedSchemeId, undefined);
        break;
      case 'U':
        this.populateUpdateForm(isin, classid);
        break;
    }
  }

  protected mapCompanyToBank(action?: string) {
    if (action == 'I') {
      this.getclassmapdata = this.editClassForm.value;
    } else {
      this.getclassmapdata = this.classForm.value;
    }
    this.getclassmapdata.action = action;
    this.apiService
      .postRequestLegacy(
        FeatureList.equity,
        'addOrUpdateEquityIsin',
        this.getclassmapdata
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data != null) {
          }
          console.log('add/update');
          this.hideForm();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
