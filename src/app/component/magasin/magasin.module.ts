import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MagasinRoutingModule } from './magasin-routing.module';
import { MLayoutComponent } from './m-layout/m-layout.component';
import {SharedModule} from "../shared/shared.module";
import { DashboardMagasinComponent } from './dashboard-magasin/dashboard-magasin.component';
import {ReactiveFormsModule} from "@angular/forms";
import { UnitesComponent } from './unites/unites.component';
import { DetailsMagasinComponent } from './details-magasin/details-magasin.component';
import {NgxPaginationModule} from "ngx-pagination";
import {ClientModule} from "../client/client.module";


@NgModule({
  declarations: [
    MLayoutComponent,
    DashboardMagasinComponent,
    UnitesComponent,
    DetailsMagasinComponent
  ],
    imports: [
        CommonModule,
        MagasinRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule,
        ClientModule
    ]
})
export class MagasinModule { }
