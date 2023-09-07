import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PretsRoutingModule } from './prets-routing.module';
import { PretLayoutComponent } from './pret-layout/pret-layout.component';
import { PretIndexComponent } from './pret-index/pret-index.component';
import {SharedModule} from "../shared/shared.module";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PretLayoutComponent,
    PretIndexComponent
  ],
    imports: [
        CommonModule,
        PretsRoutingModule,
        SharedModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class PretsModule { }
