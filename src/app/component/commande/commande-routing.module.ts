import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommandLayoutComponent} from "./command-layout/command-layout.component";
import {IndexCommandComponent} from "./index-command/index-command.component";
import {EditComponent} from "./edit/edit.component";
import {AmountVoucherPipe} from "./pipes/amount-voucher.pipe";

const routes: Routes = [
  { path:'', component: CommandLayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: IndexCommandComponent},
      { path: 'complete-order/:id', component: EditComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [
    AmountVoucherPipe
  ],
  exports: [RouterModule, AmountVoucherPipe]
})
export class CommandeRoutingModule { }
