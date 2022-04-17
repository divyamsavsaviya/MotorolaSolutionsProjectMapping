import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './dash-board/dash-board.component';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashBoard',
    component: DashBoardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'userManagement',
        component: UserManagementComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'projectManagement',
        component: ProjectManagementComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, DashBoardComponent]