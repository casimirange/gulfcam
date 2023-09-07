import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MangwaRoutingModule } from './mangwa-routing.module';
import { MangwaLayoutComponent } from './mangwa-layout/mangwa-layout.component';
import { IndexMangwaComponent } from './index-mangwa/index-mangwa.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    MangwaLayoutComponent,
    IndexMangwaComponent
  ],
    imports: [
        CommonModule,
        MangwaRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FormsModule
    ]
})
export class MangwaModule { }
