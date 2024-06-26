import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

export interface option {
  id: any;
  value: string;
}

@Component({
  selector: 'app-upload-indices',
  templateUrl: './upload-indices.component.html',
  styleUrls: ['./upload-indices.component.scss'],
})
export class UploadIndicesComponent implements OnInit {
  params: any;
  indexFormParams: any;
  selectedFile: File | null = null;
  uploadmsg: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
  niftyOption: option[] = [
    { id: 'nifty50', value: 'Nifty 50' },
    { id: 'nifty200', value: 'Nifty 200' },
    { id: 'sensex50', value: 'Sensex 50' },
    { id: 'sensex200', value: 'Sensex 200' },
  ];

  indexrateForm = new FormGroup({
    niftyoption: new FormControl(''),
  });

  protected getFormControllers(name: string) {
    const ctrl = this.indexrateForm.get(name) as FormControl;
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

  uploadindexrate() {
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
        'uploadindexdata',
        this.indexrateForm.value
      )
      .subscribe({
        next: (response: any) => {
          this.indexrateForm.reset();
          window.alert(response.message);
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        },
      });
  }
}
