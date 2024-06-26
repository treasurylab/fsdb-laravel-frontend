import { ApiService } from 'src/app/shared/services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  lmList: any[] | undefined;
  userType: { id: string; value: string }[] | undefined;
  userInfoForm: any = [];

  constructor(
    private apiService: ApiService,
    protected dialog: MatDialog,
    private dialogRef: MatDialogRef<AddUserComponent>
  ) {}

  ngOnInit(): void {
    this.getUserMenuList();
    this.userType = [
      { id: 'mr', value: 'Mr.' },
      { id: 'mrs', value: 'Mrs.' },
    ];
  }

  protected userMastForm = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    cgrp_id: new FormControl(''),
    password: new FormControl(''),
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

  protected userInfoEntry() {
    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.adminUser,
        'userInfoEntry',
        this.userMastForm.value
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('New User Added');
          this.dialogRef.close();
          window.location.reload();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
