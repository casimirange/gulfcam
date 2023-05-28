import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditNoteRoutingModule } from './credit-note-routing.module';
import { IndexCreditNoteComponent } from './index-credit-note/index-credit-note.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import { DetailsCreditNoteComponent } from './details-credit-note/details-credit-note.component';
import {ClientModule} from "../client/client.module";


@NgModule({
  declarations: [
    IndexCreditNoteComponent,
    DetailsCreditNoteComponent
  ],
    imports: [
        CommonModule,
        CreditNoteRoutingModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FormsModule,
        ClientModule
    ]
})
export class CreditNoteModule { }
