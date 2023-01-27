import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PreloaderComponent} from "./preloader/preloader.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./component/shared/shared.module";
import {Erreur404Component} from "./component/erreur404/erreur404.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
// import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {TokenInterceptorProvider} from "./_helpers/token.interceptor";
import { CopyAndPasteDirective } from './directive/copy-and-paste.directive';
import {NgOtpInputModule} from "ng-otp-input";
import {ClientService} from "./_services/clients/client.service";
import {NgxPaginationModule} from "ngx-pagination";
import { CouponLayoutComponent } from './component/coupons/coupon-layout/coupon-layout.component';
import { IndexCouponComponent } from './component/coupons/index-coupon/index-coupon.component';
import {BnNgIdleService} from "bn-ng-idle";
import { CreditNoteLayoutComponent } from './component/creditNote/credit-note-layout/credit-note-layout.component';
import {ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './preloader/loader/loader.component';
import {ConnectionServiceModule} from "ng-connection-service";
import {TokenService} from "./_services/token/token.service";
// import {OnlineStatusModule} from "ngx-online-status";
// import {Ng2SearchPipeModule} from "ng2-search-filter";
// import {Ng2OrderModule} from "ng2-order-pipe";

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    Erreur404Component,
    CopyAndPasteDirective,
    CouponLayoutComponent,
    IndexCouponComponent,
    CreditNoteLayoutComponent,
    LoaderComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    NgOtpInputModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ConnectionServiceModule
    // SweetAlert2Module.forRoot(),
    // Ng2SearchPipeModule,
    // Ng2OrderModule
    // OnlineStatusModule
  ],
  providers: [
    TokenInterceptorProvider,
    BnNgIdleService,
    TokenService
    // ClientService
  ],
  bootstrap: [AppComponent],
    exports: [
        LoaderComponent,


    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
