import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-rbi-upload',
  templateUrl: './rbi-upload.component.html',
  styleUrls: ['./rbi-upload.component.scss'],
})
export class RbiUploadComponent {
  protected selectedFile: File | null = null;
  protected rbirateForm = new FormGroup({
    sdate: new FormControl(''),
  });

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  protected getFormControllers(name: string) {
    const ctrl = this.rbirateForm?.get(name) as FormControl;
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

  protected uploadRbiRate() {
    if (this.selectedFile === null || this.selectedFile === undefined) {
      return;
    }
    const fileObject = {
      file: this.selectedFile,
    };
    this.apiService
      .postFileUpload<GenericResponse<any>>(
        FeatureList.benchmark,
        fileObject,
        'uploadRbiRate',
        this.rbirateForm.value
      )
      .subscribe(
        (response) => {
          this.rbirateForm.reset();
          window.alert(response.message);
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
  }
}
