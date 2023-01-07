import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StockCartonComponent} from "./stock-carton/stock-carton.component";
import {TransfererCartonComponent} from "./transferer-carton/transferer-carton.component";
import {CartonLayoutComponent} from "./carton-layout/carton-layout.component";

const routes: Routes = [
  { path:'', component: CartonLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: StockCartonComponent},
      { path: 'transferer/:id', component: TransfererCartonComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartonsRoutingModule { }
