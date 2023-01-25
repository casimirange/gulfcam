import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileUserComponent} from "./profile-user/profile-user.component";
import {ProfileLayoutComponent} from "./profile-layout/profile-layout.component";

const routes: Routes = [
  { path:'', component: ProfileLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'user/:id', component: ProfileUserComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
