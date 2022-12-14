import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartonsRoutingModule } from './cartons-routing.module';
import { StockCartonComponent } from './stock-carton/stock-carton.component';
import { TransfererCartonComponent } from './transferer-carton/transferer-carton.component';
import { CartonLayoutComponent } from './carton-layout/carton-layout.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    StockCartonComponent,
    TransfererCartonComponent,
    CartonLayoutComponent
  ],
    imports: [
        CommonModule,
        CartonsRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ]
})
export class CartonsModule { }
