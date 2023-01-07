import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexCarnetComponent} from "./index-carnet/index-carnet.component";
import {ApprovisionnerCarnetComponent} from "./approvisionner-carnet/approvisionner-carnet.component";
import {CarnetLayoutComponent} from "./carnet-layout/carnet-layout.component";

const routes: Routes = [
  { path:'', component: CarnetLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: IndexCarnetComponent},
      { path: 'approvisionner', component: ApprovisionnerCarnetComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarnetsRoutingModule { }
