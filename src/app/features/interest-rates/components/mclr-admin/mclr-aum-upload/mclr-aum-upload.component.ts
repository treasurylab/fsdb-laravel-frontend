import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-mclr-aum-upload',
  templateUrl: './mclr-aum-upload.component.html',
  styleUrls: ['./mclr-aum-upload.component.scss'],
})
export class MclrAumUploadComponent implements OnInit {
  protected years: Array<number> = [];
  protected file?: File;
  protected selectedFile: File | null = null;

  protected linkIcon = faLink;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.populateYears();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const currentYear = today.getFullYear().toString();
    this.mclraum!.get('year')!.setValue(currentYear);
  }

  protected mclraum = new FormGroup({
    year: new FormControl(''),
    filename: new FormControl(''),
  });

  protected getFormControllers(name: string) {
    const ctrl = this.mclraum?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  private populateYears() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 50;
    for (let year = 2020; year <= endYear; year++) {
      this.years.push(year);
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

  protected uploadMclrAum() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.mclr,
        fileObject,
        'uploadMclrAum',

        this.mclraum.value
      )
      .subscribe({
        next: (response: any) => {
          alert(response['msg']);
        },
      });
  }
}
