import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponsRoutingModule } from './coupons-routing.module';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    SharedModule
  ]
})
export class CouponsModule { }
