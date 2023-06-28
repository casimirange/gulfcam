import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Client} from "../../../_model/client";
import {Store} from "../../../_model/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {Order} from "../../../_model/order";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClientService} from "../../../_services/clients/client.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreService} from "../../../_services/store/store.service";
import {ProductService} from "../../../_services/product/product.service";
import {OrderService} from "../../../_services/order/order.service";
import {Products} from "../../../_model/products";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {ConfigOptions} from "../../../configOptions/config-options";
import {Router} from "@angular/router";

export class Product{
  quantity: number;
  voucher: number;
  total?: number
}
@Component({
  selector: 'app-index-caisse',
  templateUrl: './index-caisse.component.html',
  styleUrls: ['./index-caisse.component.css']
})
export class IndexCaisseComponent implements OnInit, OnDestroy {

  title = 'Enregistrer nouvelle commande';
  clients: Client[];
  client: Client;
  // stores: Store;
  showClientForm = false;
  clientForm: FormGroup ;
  orderForm: FormGroup ;
  clF: any;
  orF: any;
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  stores: Store[] ;
  loadSore: boolean;
  typeVoucher = [3000, 5000, 10000]
  tabProducts: Product[];
  tabProd: Product;
  Products: Products[] = [];
  Product: Products = new Products();
  totalOrder: number;
  vouchers: TypeVoucher[] = [];
  voucher: TypeVoucher = new TypeVoucher()
  orders: Order[] = [];
  order: Order = new Order();
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  name = ''
  clientName = ''
  storeFilter = aesUtil.decrypt(key,localStorage.getItem('store'))
  statusFilter = ''
  refCli = ''
  date = '';
  internalRef = ''
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  orderState$: Observable<AppState<CustomResponse<Order>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Order>>(null);
  private isSearching = new BehaviorSubject<boolean>(false);
  isSearching$ = this.isSearching.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  clientNotFound: boolean = false;
  onFilter: boolean = false;
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private clientService: ClientService,
              private voucherService: VoucherService, private notifsService: NotifsService, private storeService: StoreService,
              private productService: ProductService, private orderService: OrderService, private statusService: StatusOrderService,
              public global: ConfigOptions, private router: Router
  ) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }


  ngOnInit(): void {
    this.getStores()
    this.getOrders()
  }

  findClients(event: string): Client[]{
    if (event != '' && event.length >= 3){
      this.clientService.searchClient(event) .subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key,resp.key.toString())) ;
          if (!this.clients.length){
            this.notifsService.onError('Ce client n\'existe pas', '')
            this.clientNotFound = true
          }else {
            this.clientNotFound = false
          }
        }
      )
    }else {
      this.clients = []
    }
    return this.clients
  }

  getStores(){
    this.loadSore = true
    this.mySubscription = this.storeService.getStore().subscribe(
      resp => {
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.loadSore = false
      },
      error => {
        // this.notifsService.onError(error.error.message, 'échec chargement magasins')
      }
    )
  }

  getOrders(){
    this.orderState$ = this.orderService.filterOrders$(
      this.storeFilter , this.clientName, this.date, this.internalRef, this.statusFilter,
      this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  filterOrders(){

    this.orderState$ = this.orderService.filterOrders$(
      this.storeFilter, this.clientName, this.date, this.internalRef, this.statusFilter,
      this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          // this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }


  annuler() {
    this.modalService.dismissAll()
    this.tabProducts = []
    this.totalOrder = 0
    this.orF['client'].reset
  }

  pageChange(event: number){
    this.page = event
    this.orderState$ = this.orderService.filterOrders$(
      this.storeFilter, this.clientName, this.date, this.internalRef, this.statusFilter,
      this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          // this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter){
      this.statusFilter = '';
      this.clientName = '';
      this.storeFilter = aesUtil.decrypt(key, localStorage.getItem('store'))
      this.refCli = ''
      this.date = '';
      this.internalRef = ''
      this.filterOrders()
    }
  }

  findClientsForFilter(event: string): Client[]{
    if (event != '' && event.length >= 3){
      this.mySubscription2 =this.clientService.searchClient(event).subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
          if (this.clients.length <= 1){
            this.filterOrders()
          }

          if (!JSON.parse(aesUtil.decrypt(key,resp.key.toString())).length){
            this.notifsService.onError('Ce client n\'existe pas', '')
          }
        }
      )
    }else {
      if (this.clientName == ''){
        this.filterOrders()
      }
      this.clients = []
    }
    return this.clients
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
