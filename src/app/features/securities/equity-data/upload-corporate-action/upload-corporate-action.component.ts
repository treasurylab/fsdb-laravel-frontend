import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-upload-corporate-action',
  templateUrl: './upload-corporate-action.component.html',
  styleUrls: ['./upload-corporate-action.component.scss'],
})
export class UploadCorporateActionComponent implements OnInit {
  listbp: any = [];
  montlyaum: any = [];
  params: any;
  aumFormParams: any;
  fhParam: any = [];
  aumParam: any = [];
  fromDateD: any = [];
  selectedFile: File | null = null;
  protected file?: File;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {}

  corporateActionForm: FormGroup = new FormGroup({
    sdate: new FormControl(''),
    uploadfile: new FormControl(''),
  });

  ngOnInit() {}

  protected getFormControllers(name: string) {
    const ctrl = this.corporateActionForm?.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedFile = files.item(0);
    } else {
      this.selectedFile = null;
    }
  }

  uploadCorporateAction() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }

    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload(
        FeatureList.equity,
        fileObject,
        'uploadCorporateAction',
        this.corporateActionForm.value
      )
      .subscribe({
        next: (response: any) => {
          this.corporateActionForm.reset();
          window.alert(response.message);
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        },
      });
  }
}
