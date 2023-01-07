import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CouponLayoutComponent} from "./coupon-layout/coupon-layout.component";
import {IndexCouponComponent} from "./index-coupon/index-coupon.component";

const routes: Routes = [
  { path: '', component: CouponLayoutComponent, children: [
      { path: '', redirectTo: 'index', pathMatch: 'full'},
      { path: 'index', component: IndexCouponComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
