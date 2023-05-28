import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeRoutingModule } from './commande-routing.module';
import { CommandLayoutComponent } from './command-layout/command-layout.component';
import {SharedModule} from "../shared/shared.module";
import { EditComponent } from './edit/edit.component';
import {IndexCommandComponent} from "./index-command/index-command.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ClientNameFilterPipe } from './pipes/client-name-filter.pipe';
import { ClientRefFilterPipe } from './pipes/client-ref-filter.pipe';
import { OrderRefFilterPipe } from './pipes/order-ref-filter.pipe';
import { OrderDateFilterPipe } from './pipes/order-date-filter.pipe';
import {NgxPaginationModule} from "ngx-pagination";
import {ClientModule} from "../client/client.module";


@NgModule({
    declarations: [
        CommandLayoutComponent,
        IndexCommandComponent,
        EditComponent,
        ClientNameFilterPipe,
        ClientRefFilterPipe,
        OrderRefFilterPipe,
        OrderDateFilterPipe,
    ],
    imports: [
        CommonModule,
        CommandeRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        ClientModule,
    ],
    exports: [
        OrderDateFilterPipe,
        OrderRefFilterPipe
    ],
    providers: [

    ]
})
export class CommandeModule { }
