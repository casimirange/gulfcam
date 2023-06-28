import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotifsService} from "./_services/notifications/notifs.service";
// import {ConnectionService} from "ng-connection-service";
// import {OnlineStatusService, OnlineStatusType} from "ngx-online-status";
import {fromEvent, interval, merge, Observable, Observer, of, Subscription} from "rxjs";
import {filter, first, map, mapTo} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";
import {BnNgIdleService} from "bn-ng-idle";
import {NavigationStart, Router} from "@angular/router";
import {TokenService} from "./_services/token/token.service";
import {Location} from "@angular/common";
import {ConnectionService} from "ng-connection-service";
import IdleTimer from "src/app/_helpers/idleTimer.js"
import {aesUtil} from "./_helpers/aes";
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  // timer: 5000,
  timerProgressBar: true,
  // didOpen: (toast) => {
  //   toast.addEventListener('mouseenter', Swal.stopTimer)
  //   toast.addEventListener('mouseleave', Swal.resumeTimer)
  // }
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'gulfin';
  isConnected = true;
  noInternetConnection: boolean;
  source = interval(3000)
  url: string = '';
  // timer: number = 0;
  timer: any;
  online$: Observable<boolean>;
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  constructor(private notifsService: NotifsService, private tokenService: TokenService, private _http: HttpClient, private connectionService: ConnectionService,
              private bnIdle: BnNgIdleService, private router: Router, private _location: Location) {

    // this.connectionService.monitor().subscribe(isConnected => {
    //   console.log(isConnected)
    //   this.isConnected = isConnected.hasInternetAccess;
    //   if (this.isConnected) {
    //     this.noInternetConnection=false;
    //   }
    //   else {
    //     this.noInternetConnection=true;
    //   }
    // })
    //
    // this.online$ = merge(
    //   of(navigator.onLine),
    //   fromEvent(window, 'online').pipe(mapTo(true)),
    //   fromEvent(window, 'offline').pipe(mapTo(false))
    // );
    //
    // console.log('op',this.online$)

  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      this.url = this._location.path()
    });
    if (!this.url.includes('/auth')) {
      this.timer = new IdleTimer({
        timeout: 1800, //expired after 30 minutes
        onTimeout: () => {
          if (!this.url.startsWith('/auth')) {
            this.notifsService.inactivityUser()
          }
        }
      });
    }

    // this.router.events.subscribe((val) => {
    //   // console.log(this._location.path())
    //   this.url = this._location.path()
    // });
    // if (this.url != '/auth/login' && this.url != '/auth/otp'){
      //vérifier l'inactivité de l'utilisateur pendant 15 minutes puis le déconnecter
      // this.tokenService.userInactivity()
      // this.notifsService.expiredSession()
      // this.bnIdle.startWatching(10).subscribe((isTimedOut: boolean) => {
      //   if (isTimedOut) {
      //     this.bnIdle.stopTimer()
      //   }
      // });
    // }
    // this.checkNetworkStatus();
  }

  ngOnDestroy(): void {
    this.timer.clear();
    // this.networkStatus$.unsubscribe();
  }

  // To check internet connection stability
  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.networkStatus = status;
      });
  }

}
