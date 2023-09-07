import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PreloaderComponent} from "./preloader/preloader.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./component/shared/shared.module";
import {Erreur404Component} from "./component/erreur404/erreur404.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TokenInterceptorProvider} from "./_helpers/token.interceptor";
import {CopyAndPasteDirective} from './directive/copy-and-paste.directive';
import {NgOtpInputModule} from "ng-otp-input";
import {NgxPaginationModule} from "ngx-pagination";
<<<<<<< HEAD
import {BnNgIdleService} from "bn-ng-idle";
import {ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './preloader/loader/loader.component';
import {ConnectionServiceModule} from "ng-connection-service";
import {
  HttpConnectivity,
  HttpConnectivityInterceptor,
  InternetConnectivity,
  NgxConnectivityModule
} from "ngx-connectivity";
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
=======
import {CouponLayoutComponent} from './component/coupons/coupon-layout/coupon-layout.component';
import {IndexCouponComponent} from './component/coupons/index-coupon/index-coupon.component';
import {BnNgIdleService} from "bn-ng-idle";
import {CreditNoteLayoutComponent} from './component/creditNote/credit-note-layout/credit-note-layout.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoaderComponent} from './preloader/loader/loader.component';
import {ConnectionServiceModule} from "ng-connection-service";
import {TokenService} from "./_services/token/token.service";
import {ClientModule} from "./component/client/client.module";
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    Erreur404Component,
    CopyAndPasteDirective,
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
    ConnectionServiceModule,
<<<<<<< HEAD
    NgxConnectivityModule
=======
    FormsModule,
    ClientModule,
    // ClientModule,
    // FormatDatePipe
    // SweetAlert2Module.forRoot(),
    // Ng2SearchPipeModule,
    // Ng2OrderModule
    // OnlineStatusModule
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
  ],
  providers: [
    TokenInterceptorProvider,
    BnNgIdleService,
<<<<<<< HEAD
    { provide: LocationStrategy, useClass: PathLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConnectivityInterceptor, // <--- Important to use **InternetConnectivity**
      multi: true
    },
    InternetConnectivity,
      HttpConnectivity
=======
    TokenService
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
    // ClientService
  ],
  bootstrap: [AppComponent],
  exports: [
    LoaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
