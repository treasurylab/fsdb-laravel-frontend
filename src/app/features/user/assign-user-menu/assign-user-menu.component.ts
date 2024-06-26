import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { FeatureList } from 'src/features';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-assign-user-menu',
  templateUrl: './assign-user-menu.component.html',
  styleUrls: ['./assign-user-menu.component.scss'],
})
export class AssignUserMenuComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();

  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  displayedColumns = ['no', 'menu Code', 'role', 'action'];

  ngOnInit(): void {
    this.getMenuRole();
  }

  showListing: boolean = false;
  MenuList: any;
  protected addIcon = faPlus;

  getMenuRole() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(FeatureList.menu, 'getMenuRole')
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.MenuList = data['data'];
          this.dataSource = new MatTableDataSource(this.MenuList);
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
