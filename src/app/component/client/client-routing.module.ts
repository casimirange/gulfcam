import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexClientComponent} from "./index-client/index-client.component";
import {ClientLayoutComponent} from "./client-layout/client-layout.component";
import {DetailsComponent} from "./details/details.component";


const routes: Routes = [
  { path: '', component: ClientLayoutComponent, children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: IndexClientComponent},
      { path: ':id', component: DetailsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
