import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmandeRoutingModule } from './amande-routing.module';
import { LayoutAmandeComponent } from './layout-amande/layout-amande.component';
import { IndexAmandeComponent } from './index-amande/index-amande.component';
import {SharedModule} from "../shared/shared.module";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LayoutAmandeComponent,
    IndexAmandeComponent
  ],
    imports: [
        CommonModule,
        AmandeRoutingModule,
        SharedModule,
        NgxPaginationModule,
        FormsModule
    ]
})
export class AmandeModule { }
