import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { AddUserComponent } from './add-user/add-user.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { EditUserComponent } from './edit-user/edit-user.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.scss'],
})
export class CreateUsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  userList: any;
  viewform: boolean = false;
  protected addIcon = faPlus;

  displayedColumns = [
    'srno',
    'usercode',
    'username',
    'useremail',
    'usermobile',
    'cgrp',
    'resetpwd',
    'status',
    'action',
  ];
  displayedColumnsMenu = ['menuname', 'create', 'update', 'delete', 'upload'];

  userInfo = new FormGroup({
    usercode: new FormControl(''),
    username: new FormControl(''),
    useremail: new FormControl(''),
    usermobile: new FormControl(''),
    cgrp: new FormControl(''),
    userrole: new FormControl(''),
    menurole: new FormControl(''),
    create: new FormControl(''),
    update: new FormControl(''),
  });

  ngOnInit(): void {
    this.getuserList();
  }

  showListing: boolean = false;
  getuserList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.adminUser,
        'getAllUsersList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.userList = data['data'];
          this.dataSource = new MatTableDataSource(this.userList);
          this.dataSource!.paginator = this.paginator;

          this.showListing = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  HideForm() {
    this.viewform = false;
    this.showListing = true;
    this.getuserList();
  }

  deleteUser(code: any) {
    if (confirm('Are you sure to delete this item?')) {
      const requestParams = { code: code };

      this.apiService
        .postRequestLegacy<GenericResponse<any>>(
          FeatureList.adminUser,
          'deleteUser',
          requestParams
        )
        .pipe(first())
        .subscribe({
          next: (data: any) => {
            console.log('User Deleted');
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
    this.getuserList();
  }

  editUserInfo(userData: any) {
    this.openModal1(userData);
  }

  adduserinfo() {
    const dialogRef = this.dialog.open(AddUserComponent, {});
  }

  protected openModal1(userData: any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: userData,
    });
  }

  resetPassword(code: any) {
    const requestParams = { code: code };

    this.apiService
      .postRequestLegacy<GenericResponse<any>>(
        FeatureList.auth,
        'resetPassword',
        requestParams
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          console.log('Password reset successful:');
        },
        error: (error) => {
          console.error('Password reset failed:', error);
        },
      });
  }
}
