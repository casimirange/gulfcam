import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeanceRoutingModule } from './seance-routing.module';
import {SeanceLayoutComponent} from "./seance-layout/seance-layout.component";
import {IndexSeanceComponent} from "./index-seance/index-seance.component";
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {DetailSeanceComponent} from "./detail-seance/detail-seance.component";


@NgModule({
  declarations: [
    SeanceLayoutComponent,
    IndexSeanceComponent,
    DetailSeanceComponent,
  ],
  imports: [
    CommonModule,
    SeanceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class SeanceModule { }
