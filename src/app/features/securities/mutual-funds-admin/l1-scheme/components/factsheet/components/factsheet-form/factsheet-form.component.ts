import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { faFilter, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-factsheet-form',
  templateUrl: './factsheet-form.component.html',
  styleUrl: './factsheet-form.component.scss',
})
export class FactsheetFormComponent implements OnInit {
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Output() formCallback = new EventEmitter<any>();
  protected filterIcon = faFilter;
  protected searchIcon = faSearch;
  protected closeIcon = faXmark;
  protected factsheet = new FormGroup({
    year: new FormControl(''),
    month: new FormControl(''),
    fmList: new FormControl(''),
    category: new FormControl(''),
  });
  protected fyyears = [
    { id: 2027, name: '2027' },
    { id: 2026, name: '2026' },
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
  protected allmonths = [
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
  protected categoryList = [
    { id: 'debt', value: 'Debt' },
    { id: 'fmp', value: 'FMP' },
    { id: 'equity', value: 'Equity' },
    { id: 'hybrid', value: 'Hybrid' },
    { id: 'other', value: 'Other' },
  ];
  protected fundHouseList = new Array<any>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.lOneSchemeEditingData();
  }

  protected getFormControllers(name: string) {
    const ctrl = this.factsheet?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected submitForm() {
    this.formCallback.emit(this.factsheet.value);
  }

  private lOneSchemeEditingData() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.lOneScheme,
        'lOneSchemeEditingData'
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.fundHouseList = data['data']['list_fund'];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected closeNav() {
    this.sideNavObj.toggleFormNav();
  }
}
