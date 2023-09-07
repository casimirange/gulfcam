import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisciplineRoutingModule } from './discipline-routing.module';
import { DisciplineComponent } from './index/discipline.component';
import { LayoutDisciplineComponent } from './layout-discipline/layout-discipline.component';
import {SharedModule} from "../shared/shared.module";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DisciplineComponent,
    LayoutDisciplineComponent
  ],
    imports: [
        CommonModule,
        DisciplineRoutingModule,
        SharedModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class DisciplineModule { }
