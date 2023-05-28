import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OppositionRoutingModule } from './opposition-routing.module';
import { RequestOppositionLayoutComponent } from './request-opposition-layout/request-opposition-layout.component';
import { IndexRequestOppositionComponent } from './index-request-opposition/index-request-opposition.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DetailsRequestOppositionComponent } from './details-request-opposition/details-request-opposition.component';
import {NgxPaginationModule} from "ngx-pagination";
import {ClientModule} from "../client/client.module";


@NgModule({
  declarations: [
    RequestOppositionLayoutComponent,
    IndexRequestOppositionComponent,
    DetailsRequestOppositionComponent
  ],
    imports: [
        CommonModule,
        OppositionRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        ClientModule
    ]
})
export class OppositionModule { }
