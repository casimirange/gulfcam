import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PretLayoutComponent} from "./pret-layout/pret-layout.component";
import {PretIndexComponent} from "./pret-index/pret-index.component";

const routes: Routes = [
  { path:'', component: PretLayoutComponent, children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: PretIndexComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PretsRoutingModule { }
