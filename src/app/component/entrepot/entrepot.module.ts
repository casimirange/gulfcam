import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntrepotRoutingModule } from './entrepot-routing.module';
import { EntrepotLayoutComponent } from './entrepot-layout/entrepot-layout.component';
import { IndexEntrepotComponent } from './index-entrepot/index-entrepot.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { DetailsEntrepotComponent } from './details-entrepot/details-entrepot.component';
import {NgxPaginationModule} from "ngx-pagination";
import {ClientModule} from "../client/client.module";
import { ItemsComponent } from './items/items.component';
// import {AppModule} from "../../app.module";


@NgModule({
  declarations: [
    EntrepotLayoutComponent,
    IndexEntrepotComponent,
    DetailsEntrepotComponent,
    ItemsComponent,
  ],
  imports: [
    CommonModule,
    EntrepotRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ClientModule,
    // AppModule,
  ]
})
export class EntrepotModule { }
