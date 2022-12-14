import { Component, OnInit } from '@angular/core';
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
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {Coupon} from "../../../_model/coupon";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  client: Client;
  orders: Order[] = [];
  order: Order = new Order();
  stores: Store[] = [];
  roleUser = localStorage.getItem('userAccount').toString()
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
  constructor(private clientService: ClientService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
              private orderService: OrderService, private notifService: NotifsService, private storeService: StoreService,
              private couponService: CouponService, private statusService: StatusOrderService) {
    this.client = new Client()
    this.IdParam = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getClientInfos()
    this.getStores()
    this.getClientOrders()
  }

  getClientInfos(){
    this.appState$ = this.clientService.showClient$(parseInt(this.IdParam))
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
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

    this.clientOrder$ = this.orderService.clientOrders$(this.page - 1, this.size, parseInt(this.IdParam))
      .pipe(
        map(response => {
          console.log('client order', response)
          this.dataSubjectsClientOrder.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
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
    this.orderService.sendOrderByClient(parseInt(this.IdParam)).subscribe(
      res => {
        this.isLoading.next(false)
        this.notifService.onSuccess('Mail des commandes envoy?? au client')
      },
      error => {
        this.isLoading.next(false)
      }
    )

  }

  sendClientCoupons(){
    this.isSendding.next(true)
      this.couponService.sendCouponByClient(parseInt(this.IdParam)).subscribe(
        res => {
          this.isSendding.next(false)
          this.notifService.onSuccess('Mail des coupons envoy?? au client')
        },
        error => {
          this.isSendding.next(false)
        }
      )
  }

  getStores(){
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
      error => {
        this.notifService.onError(error.error.message, '??chec chargement magasins')
      }
    )
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.clientOrder$ = this.orderService.clientOrders$(this.page - 1, this.size, parseInt(this.IdParam))
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
}
