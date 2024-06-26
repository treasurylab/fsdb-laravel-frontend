import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  modalData: any;
  id: any;
  sebi1info: any = [];
  sebiinfoedit = false;
  showListing = true;
  sebiinfoFormParams: any = [];
  params: any;
  fundmanager: any;
  mfServices: any;
  singlel1scheme: any;
  dataSource1: any;
  l1scheme_id: any;
  list1: any;
  userType: { id: string; value: string }[] | undefined;
  lmList: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: any,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditUserComponent>
  ) {}

  ngOnInit(): void {
    this.getUserMenuList();
    this.userType = [
      { id: 'Mr.', value: 'Mr.' },
      { id: 'Mrs.', value: 'Mrs.' },
    ];
    this.userMastForm.patchValue({
      title: this.userData.title,
      code: this.userData.code,
      first_name: this.userData.first_name,
      middle_name: this.userData.middle_name,
      last_name: this.userData.last_name,
      phone: this.userData.phone,
      email: this.userData.email,
      cgrp_id: this.userData.cgrp_id,
      landing_menucode: this.userData.landing_menucode,
    });
  }

  userMastForm = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    cgrp_id: new FormControl(''),
    landing_menucode: new FormControl(''),
  });

  getUserMenuList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.menu,
        'getUserMenuList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data.data != null) {
            this.lmList = data.data;
            this.dataSource1 = new MatTableDataSource(this.lmList);
            console.log(this.dataSource1);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  userEditInfoEntry() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.adminUser,
        'editUser',
        this.userMastForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('Updated Successfuly..');
          this.dialogRef.close();
          window.location.reload();
        },

        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
