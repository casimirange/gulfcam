import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {StatusOrderService} from "../../../_services/status/status-order.service";

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
export class IndexCaisseComponent implements OnInit {

  title = 'Enregistrer nouvelle commande';
  clients: Client[] = [];
  client: Client;
  // stores: Store;
  showClientForm = false;
  clientForm: FormGroup ;
  orderForm: FormGroup ;
  clF: any;
  orF: any;
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  stores: Store[] = [];
  typeVoucher = [3000, 5000, 10000]
  tabProducts: Product[] = [];
  tabProd: Product;
  Products: Products[] = [];
  Product: Products = new Products();
  totalOrder: number;
  vouchers: TypeVoucher[] = [];
  voucher: TypeVoucher = new TypeVoucher()
  orders: Order[] = [];
  order: Order = new Order();
  roleUser = localStorage.getItem('userAccount').toString()
  name = ''
  refCli = ''
  date = ''
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
  constructor(private fb: FormBuilder, private modalService: NgbModal, private clientService: ClientService,
              private voucherService: VoucherService, private notifsService: NotifsService, private storeService: StoreService,
              private productService: ProductService, private orderService: OrderService, private statusService: StatusOrderService) {
    this.formClient();
    this.formOrder();
    this.clF = this.clientForm.controls;
    this.orF = this.orderForm.controls;
  }

  //initialisation du formulaire de création client
  formClient(){
    this.clientForm = this.fb.group({
      completeName: ['', [Validators.required, Validators.minLength(3)]],
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[2,6][0-9]{8}'), Validators.minLength(9), Validators.maxLength(9) ]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      gulfcamAccountNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      rccm: ['', [Validators.required, Validators.minLength(2)]],
      typeClient: ['', [Validators.required]],
    });
  }

  //initialisation de création du formulaire de commande
  formOrder(){
    this.orderForm = this.fb.group({
      client: ['', [Validators.required, Validators.minLength(3)]],
      store: ['', [Validators.required, ]],
      chanel: ['', [Validators.required, ]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      voucherType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getOrders()
    // this.getStores()
  }

  // getStores(){
  //   this.storeService.getStore().subscribe(
  //     res => {
  //       this.stores = res.content
  //     }
  //   )
  // }

  getOrders(){
    // let store = localStorage.getItem('store');

    this.orderState$ = this.orderService.orders$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.orders = response.content.filter(order => order.status.name === 'CREATED' || order.status.name === 'ACCEPTED')
          this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
    // this.orderService.getOrders().subscribe(
    //   resp =>{
    //     // this.orders =
    //     this.orders = resp.content.filter(order => order.status.name === 'CREATED' || order.status.name === 'ACCEPTED')
    //   },
    //   err => {
    //     this.notifsService.onError(err.error.message, 'échec chargement liste des commandes')
    //   }
    // )
  }

  pageChange(event: number){
    this.page = event
    // let store = localStorage.getItem('store');
    this.orderState$ = this.orderService.orders$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.orders = response.content.filter(order => order.status.name === 'CREATED' || order.status.name === 'ACCEPTED')
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
}
