import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-assign-user-role',
  templateUrl: './assign-user-role.component.html',
  styleUrls: ['./assign-user-role.component.scss'],
})
export class AssignUserRoleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();

  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  displayedColumns = ['no', 'user Code', 'role', 'action'];

  ngOnInit(): void {
    this.getAllUserRole();
  }

  showListing: boolean = false;
  UserList: any;
  protected addIcon = faPlus;

  getAllUserRole() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.adminUser,
        'getAllUserRole'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.UserList = data['data'];
          this.dataSource = new MatTableDataSource(this.UserList);
          this.dataSource!.paginator = this.paginator;
          this.showListing = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
