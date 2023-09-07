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
<<<<<<< HEAD
import {HttpConnectivity, InternetConnectivity, NgxConnectivityModule} from "ngx-connectivity";
=======
import IdleTimer from "src/app/_helpers/idleTimer.js"
import {aesUtil} from "./_helpers/aes";
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
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

  internetSubscription: Subscription;
  internet_status: Boolean;

  constructor(private notifsService: NotifsService, private tokenService: TokenService, private _http: HttpClient, private connectionService: ConnectionService,
<<<<<<< HEAD
              private bnIdle: BnNgIdleService, private router: Router, private _location: Location, public internetConnectivity: InternetConnectivity,
              public httpConnectivity: HttpConnectivity) {
=======
              private bnIdle: BnNgIdleService, private router: Router, private _location: Location) {

>>>>>>> 37d14d372724acd031f893c0236343c371360e75
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
<<<<<<< HEAD
    // this.connectivityService.n
=======
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

>>>>>>> 37d14d372724acd031f893c0236343c371360e75
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
  //   this.internetSubscription = this.internetConnectivity.isOnline$.subscribe(
  //     d => {
  //       console.log(d);
  //       this.internet_status = d;
  //     }
  //   )
  //
  //   // statistics of every http connection
  //   this.httpConnectivity.connectionSpy$.subscribe(
  //     d => {
  //       console.log(d);
  //     }
  //   )
  //
  //   // true is any http connection is open else false
  //   this.httpConnectivity.isConnected$.subscribe(
  //     d => {
  //       console.log(d);
  //     }
  //   )
  //
  //   // count of open http connection
  //   this.httpConnectivity.connectionCount$.subscribe(
  //     d => {
  //       console.log(d);
  //     }
  //   )
  }

  ngOnDestroy(): void {
<<<<<<< HEAD
    // this.internetSubscription.unsubscribe();
=======
    this.timer.clear();
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
    // this.networkStatus$.unsubscribe();
  }

  // To check internet connection stability
<<<<<<< HEAD
  // checkNetworkStatus() {
  //   this.networkStatus = navigator.onLine;
  //   this.networkStatus$ = merge(
  //     of(null),
  //     fromEvent(window, 'online'),
  //     fromEvent(window, 'offline')
  //   )
  //     .pipe(map(() => navigator.onLine))
  //     .subscribe(status => {
  //       console.log('status', status);
  //       this.networkStatus = status;
  //     });
  // }
=======
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
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

}
