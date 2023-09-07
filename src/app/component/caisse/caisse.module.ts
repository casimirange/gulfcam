import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaisseRoutingModule } from './caisse-routing.module';
import { CaisseLayoutComponent } from './caisse-layout/caisse-layout.component';
import { IndexCaisseComponent } from './index-caisse/index-caisse.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {CommandeModule} from "../commande/commande.module";
import {ClientModule} from "../client/client.module";


@NgModule({
  declarations: [
    CaisseLayoutComponent,
    IndexCaisseComponent
  ],
    imports: [
        CommonModule,
        CaisseRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule,
        CommandeModule,
        FormsModule,
        ClientModule
    ]
})
export class CaisseModule { }
