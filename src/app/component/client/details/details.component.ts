import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from "../../../_services/clients/client.service";
import {Client, TypeClient} from "../../../_model/client";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../_services/order/order.service";
import {Order} from "../../../_model/order";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Store} from "../../../_model/store";
import {StoreService} from "../../../_services/store/store.service";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {Coupon} from "../../../_model/coupon";
import {aesUtil, key} from "../../../_helpers/aes.js";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  client: Client;
  orders: Order[] = [];
  order: Order = new Order();
  stores: Store[] = [];
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  appState$: Observable<AppState<Client>>;
  sendMailOrder$: Observable<AppState<Order>>;
  sendMailCoupon$: Observable<AppState<Coupon>>;
  clientOrder$: Observable<AppState<CustomResponse<Order>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<Client>(null);
  private dataSubjectsClientOrder = new BehaviorSubject<CustomResponse<Order>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private isSendding = new BehaviorSubject<boolean>(false);
  isSending$ = this.isSendding.asObservable();
  private IdParam: string;
  name = ''
  refCli = ''
  date = ''
  internalRef = ''
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  constructor(private clientService: ClientService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
              private orderService: OrderService, private notifService: NotifsService, private storeService: StoreService,
              private couponService: CouponService, private statusService: StatusOrderService, private router: Router) {
    this.client = new Client()
    this.IdParam = this.route.snapshot.paramMap.get('id');
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getClientInfos()
    this.getClientOrders()
  }

  getClientInfos(){
    this.appState$ = this.clientService.showClient$(this.IdParam)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )

    // this.activatedRoute.params.subscribe(params => {
    //   this.clientService.findClient(params['id']).subscribe(
    //     res => {
    //       this.client = res;
    //       console.log(res)
    //     }
    //   )
    // })
  }

  getClientOrders(){

    this.clientOrder$ = this.orderService.clientOrders$(this.page - 1, this.size, this.IdParam)
      .pipe(
        map(response => {
          // console.log('client order', JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.dataSubjectsClientOrder.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )

    // this.activatedRoute.params.subscribe(params => {
    //   this.orderService.getOrderByClient(params['id']).subscribe(
    //     res => {
    //       console.log(res)
    //       this.orders = res.content;
    //       console.log('orders', this.orders)
    //       this.notifService.onSuccess('chargement des commandes du client')
    //     }
    //   )
    // })
  }

  sendClientOrders(){
    this.isLoading.next(true)
   this.mySubscription =  this.orderService.sendOrderByClient(this.IdParam).subscribe(
      res => {
        this.isLoading.next(false)
        this.notifService.onSuccess('Mail des commandes envoyé au client')
      },
      error => {
        this.isLoading.next(false)
      }
    )

  }

  sendClientCoupons(){
    this.isSendding.next(true)
      this.mySubscription2 = this.couponService.sendCouponByClient(this.IdParam).subscribe(
        res => {
          this.isSendding.next(false)
          this.notifService.onSuccess('Mail des coupons envoyé au client')
        },
        error => {
          this.isSendding.next(false)
        }
      )
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.clientOrder$ = this.orderService.clientOrders$(this.page - 1, this.size, this.IdParam)
      .pipe(
        map(response => {
          this.dataSubjectsClientOrder.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  detailsOrder(id: number) {
    let rout = aesUtil.encrypt(key, id.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, id.toString())
    }
    this.router.navigate(['/commandes/complete-order/', rout])
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
  }
}
