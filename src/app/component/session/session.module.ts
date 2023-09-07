import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {SessionLayoutComponent} from "./session-layout/session-layout.component";
import {IndexSessionComponent} from "./index-session/index-session.component";


@NgModule({
  declarations: [
    SessionLayoutComponent,
    IndexSessionComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class SessionModule { }
