import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarnetsRoutingModule } from './carnets-routing.module';
import { ApprovisionnerCarnetComponent } from './approvisionner-carnet/approvisionner-carnet.component';
import { IndexCarnetComponent } from './index-carnet/index-carnet.component';
import { CarnetLayoutComponent } from './carnet-layout/carnet-layout.component';
import {SharedModule} from "../shared/shared.module";
import {NgxPaginationModule} from "ngx-pagination";
import {ReactiveFormsModule} from "@angular/forms";
import {ClientModule} from "../client/client.module";


@NgModule({
  declarations: [
    ApprovisionnerCarnetComponent,
    IndexCarnetComponent,
    CarnetLayoutComponent
  ],
    imports: [
        CommonModule,
        CarnetsRoutingModule,
        SharedModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        ClientModule
    ]
})
export class CarnetsModule { }
