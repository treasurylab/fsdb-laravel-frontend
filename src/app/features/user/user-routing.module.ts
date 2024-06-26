import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUsersComponent } from './create-users/create-users.component';
import { CreateUserRoleComponent } from './create-user-role/create-user-role.component';
import { AssignUserRoleComponent } from './assign-user-role/assign-user-role.component';
import { AssignUserMenuComponent } from './assign-user-menu/assign-user-menu.component';

const routes: Routes = [
  { path: 'create-user', component: CreateUsersComponent },
  { path: 'user-roles', component: CreateUserRoleComponent },
  { path: 'assign-user-roles', component: AssignUserRoleComponent },
  { path: 'assign-user-menu', component: AssignUserMenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
