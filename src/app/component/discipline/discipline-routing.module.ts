import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutDisciplineComponent} from "./layout-discipline/layout-discipline.component";
import {DisciplineComponent} from "./index/discipline.component";

const routes: Routes = [
  { path:'', component: LayoutDisciplineComponent, children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: DisciplineComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplineRoutingModule { }
