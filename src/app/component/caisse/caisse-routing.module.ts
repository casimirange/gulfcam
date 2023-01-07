import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CaisseLayoutComponent} from "./caisse-layout/caisse-layout.component";
import {IndexCaisseComponent} from "./index-caisse/index-caisse.component";

const routes: Routes = [
  { path:'', component: CaisseLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: IndexCaisseComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaisseRoutingModule { }
