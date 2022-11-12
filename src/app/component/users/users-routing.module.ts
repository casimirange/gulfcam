import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MLayoutComponent} from "../magasin/m-layout/m-layout.component";
import {DashboardMagasinComponent} from "../magasin/dashboard-magasin/dashboard-magasin.component";
import {UserLayoutComponent} from "./user-layout/user-layout.component";
import {IndexUsersComponent} from "./index-users/index-users.component";
import {DetailsUserComponent} from "./details-user/details-user.component";
import {ProfileUserComponent} from "./profile-user/profile-user.component";

const routes: Routes = [
  { path:'', component: UserLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: IndexUsersComponent},
      { path: 'add', component: IndexUsersComponent},
      { path: 'details/:id', component: DetailsUserComponent},
      { path: 'profile/:id', component: ProfileUserComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
