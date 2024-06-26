import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CreateUserRoleComponent } from './create-user-role/create-user-role.component';
import { RolePermissionComponent } from './create-user-role/components/role-permission/role-permission.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './create-users/add-user/add-user.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { EditUserComponent } from './create-users/edit-user/edit-user.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AssignUserRoleComponent } from './assign-user-role/assign-user-role.component';
import { AssignUserMenuComponent } from './assign-user-menu/assign-user-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CreateUserRoleComponent,
    RolePermissionComponent,
    AddUserComponent,
    CreateUsersComponent,
    EditUserComponent,
    AssignUserRoleComponent,
    AssignUserMenuComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    SharedModule,
  ],
})
export class UserModule {}
