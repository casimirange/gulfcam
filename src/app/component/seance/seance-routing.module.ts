import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SeanceLayoutComponent} from "./seance-layout/seance-layout.component";
import {IndexSeanceComponent} from "./index-seance/index-seance.component";
import {DetailSeanceComponent} from "./detail-seance/detail-seance.component";

const routes: Routes = [
  { path:'', component: SeanceLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: IndexSeanceComponent},
      { path: 'details/:id', component: DetailSeanceComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeanceRoutingModule { }
