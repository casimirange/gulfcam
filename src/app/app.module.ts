import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PreloaderComponent} from "./preloader/preloader.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./component/shared/shared.module";
import {Erreur404Component} from "./component/erreur404/erreur404.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TokenInterceptorProvider} from "./_helpers/token.interceptor";
import { CopyAndPasteDirective } from './directive/copy-and-paste.directive';
import {NgOtpInputModule} from "ng-otp-input";
import {NgxPaginationModule} from "ngx-pagination";
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
    NgxConnectivityModule
  ],
  providers: [
    TokenInterceptorProvider,
    BnNgIdleService,
    { provide: LocationStrategy, useClass: PathLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConnectivityInterceptor, // <--- Important to use **InternetConnectivity**
      multi: true
    },
    InternetConnectivity,
      HttpConnectivity
    // ClientService
  ],
  bootstrap: [AppComponent],
    exports: [
        LoaderComponent,


    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
