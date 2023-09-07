import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MangwaLayoutComponent} from "./mangwa-layout/mangwa-layout.component";
import {IndexMangwaComponent} from "./index-mangwa/index-mangwa.component";

const routes: Routes = [
  { path:'', component: MangwaLayoutComponent, children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: IndexMangwaComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MangwaRoutingModule { }
