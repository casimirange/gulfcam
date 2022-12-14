import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaiementMethodRoutingModule } from './paiement-method-routing.module';
import {SharedModule} from "../shared/shared.module";
import {PmLayoutComponent} from "./paiementMethod/pm-layout/pm-layout.component";
import {IndexPaiementMethodComponent} from "./paiementMethod/index-paiement-method/index-paiement-method.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PmLayoutComponent,
    IndexPaiementMethodComponent
  ],
  imports: [
    CommonModule,
    PaiementMethodRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PaiementMethodModule { }
