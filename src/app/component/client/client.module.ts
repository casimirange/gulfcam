import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { IndexClientComponent } from './index-client/index-client.component';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import {SharedModule} from "../shared/shared.module";
import { DetailsComponent } from './details/details.component';
import {ClientService} from "../../_services/clients/client.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {Ng2OrderModule} from "ng2-order-pipe";
// import {NgxPaginationModule} from "ngx-pagination";
// import {Ng2SearchPipeModule} from "ng2-search-filter";
import { ClientNameFilterPipe } from './pipes/client-name-filter.pipe';
import { ClientRefFilterPipe } from './pipes/client-ref-filter.pipe';
import { ClientDateFilterPipe } from './pipes/client-date-filter.pipe';
import { ClientCompagnyFilterPipe } from './pipes/client-compagny-filter.pipe';
import {NgxPaginationModule} from "ngx-pagination";
import {CommandeModule} from "../commande/commande.module";
import {AppModule} from "../../app.module";
import {FormatNumberPipe} from "../../pipes/formatNumber/format-number.pipe";
import {FormatDatePipe} from "../../pipes/formatDate/format-date.pipe";
import {FormatDateHourPipe} from "../../pipes/formatDateHour/format-date-hour.pipe";

@NgModule({
  declarations: [
    IndexClientComponent,
    ClientLayoutComponent,
    DetailsComponent,
    ClientNameFilterPipe,
    ClientRefFilterPipe,
    ClientDateFilterPipe,
    ClientCompagnyFilterPipe,
    FormatNumberPipe,
    FormatDatePipe,
    FormatDateHourPipe,
  ],
    imports: [
        CommonModule,
        ClientRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        // CommandeModule,

        // Ng2TelInputModule,
        // NgxIntlTelInputModule,
        // Ng2OrderModule,
        // NgxPaginationModule,
        // Ng2SearchPipeModule,
    ],
    providers: [
        ClientService,
        FormatNumberPipe,
    ],
    exports: [
        ClientNameFilterPipe,
        FormatNumberPipe,
      FormatDatePipe,
      FormatDateHourPipe,
    ]
})
export class ClientModule { }
