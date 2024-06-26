import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first, Observable, tap } from 'rxjs';

import { RolePermissionComponent } from './components/role-permission/role-permission.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-user-role',
  templateUrl: './create-user-role.component.html',
  styleUrls: ['./create-user-role.component.scss'],
})
export class CreateUserRoleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  cgrpList: any = [];
  moduleList: any = [];
  menuData: any[] = [];
  showMenuList: boolean = false;
  showCgrpList: boolean = false;
  rolelist: any = [];

  displayedColumns = ['id', 'cgrpid', 'cgrpname'];
  displayedColumnsm: string[] = ['parentName', 'childMenus'];

  ngOnInit(): void {
    this.getcgrpList();
  }

  getcgrpList() {
    this.apiService
      .getRequestLegacy(FeatureList.company, 'getCompanyList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          /* console.log(data['result']); */
          this.showCgrpList = true;
          this.cgrpList = data['data'];
          this.dataSource = new MatTableDataSource(this.cgrpList);
          this.dataSource!.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  // Transform the data to match the structure needed for the table
  formatChildMenus(menu: any): string[] {
    return menu[0];
  }

  getModuleList() {
    this.showMenuList = true;
    this.showCgrpList = false;
    this.apiService
      .getRequestLegacy(FeatureList.menu, 'getMenus')

      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.moduleList = data['data'].map((menu: any) => ({
            parentName: menu.parentName,
            childMenus: this.formatChildMenus(menu),
          }));
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  updateMenuPermission(menuname: string) {
    if (menuname) {
      let mname = { id: menuname };
      this.openDialog(mname);
    } else {
      console.log('Invalid ID');
    }
  }

  getRoleList(): Observable<any> {
    return this.apiService.getRequestLegacy(FeatureList.menu, 'getMenus').pipe(
      first(),
      tap((data: any) => {
        this.rolelist = data['result'];
      })
    );
  }

  openDialog(mname: any) {
    this.getRoleList().subscribe(() => {
      const dialogRef = this.dialog.open(RolePermissionComponent, {
        data: { title: 'Role List', items: this.rolelist, menu: mname },
      });
    });
  }
}
