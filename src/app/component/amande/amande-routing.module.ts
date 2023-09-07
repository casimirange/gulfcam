import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutAmandeComponent} from "./layout-amande/layout-amande.component";
import {IndexAmandeComponent} from "./index-amande/index-amande.component";

const routes: Routes = [
  { path:'', component: LayoutAmandeComponent, children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: IndexAmandeComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmandeRoutingModule { }
