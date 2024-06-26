import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
})
export class RolePermissionComponent {
  rolelist: any = [];
  menuname: any;

  displayedColumns = ['rolename', 'create', 'update', 'delete', 'delete'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RolePermissionComponent>
  ) {
    this.rolelist = data.items;
    this.menuname = data.menu;
  }

  updateSelectedRole(element: any) {
    //console.log(element);
    for (let i = 0; i < this.rolelist.length; i++) {
      if (this.rolelist[i].rcode === element.rcode) {
        this.rolelist[i].create = element.create;
        this.rolelist[i].update = element.update;
        this.rolelist[i].delete = element.delete;
        this.rolelist[i].upload = element.upload;
        break;
      }
    }
  }

  dataset: any = [];

  AddnRoleMenuPerm(rolelist: any[] = [], menuname: any) {
    this.dataset = { menu: menuname, rolelist: rolelist };
    // this.dbservice
    //   .admin(this.dataset, 'AddnRoleMenuPerm')
    //   .pipe(first())
    //   .subscribe({
    //     next: (data: any) => {
    //       this.dialogRef.close();
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //     },
    //   });
  }
}
