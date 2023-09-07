import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SessionLayoutComponent} from "./session-layout/session-layout.component";
import {IndexSessionComponent} from "./index-session/index-session.component";

const routes: Routes = [
  { path:'', component: SessionLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: IndexSessionComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
