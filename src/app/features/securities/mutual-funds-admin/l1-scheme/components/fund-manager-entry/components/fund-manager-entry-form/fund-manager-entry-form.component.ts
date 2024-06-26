import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { first } from 'rxjs';
import { SideFormComponent } from 'src/app/shared/components/side-form/side-form.component';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-fund-manager-entry-form',
  templateUrl: './fund-manager-entry-form.component.html',
  styleUrl: './fund-manager-entry-form.component.scss',
})
export class FundManagerEntryFormComponent implements OnChanges {
  @Output() createManagerCallback = new EventEmitter<boolean>();
  @Input({ required: true }) sideNavObj!: SideFormComponent;
  @Input({ required: true }) sideNavTitle!: string;
  @Input({ required: true }) formPayload!: {
    action: string;
    payload?: { fundmng_id: number; fundmng_name: string };
  };
  protected fundMngForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formPayload'] && this.formPayload) {
      if (this.formPayload.payload !== undefined) {
        this.fundMngForm.setValue({
          name: this.formPayload.payload.fundmng_name,
        });
      } else {
        this.fundMngForm.reset();
      }
    }
  }

  protected createFundManagerDetails() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.FundManagerDetails,
        'createFundManagerDetails',
        this.fundMngForm.value
      )
      .pipe(first())
      .subscribe({
        next: (_) => {
          alert('New Fund Manager Added');
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.fundMngForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected closeNav() {
    this.sideNavObj.toggleFormNav();
  }
}
