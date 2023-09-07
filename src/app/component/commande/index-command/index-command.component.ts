import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Client} from "../../../_model/client";


import {ClientService} from "../../../_services/clients/client.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IndexClientComponent} from "../../client/index-client/index-client.component";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {Products} from "../../../_model/products";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Store} from "../../../_model/store";
import {StoreService} from "../../../_services/store/store.service";
import {Order} from "../../../_model/order";
import {ProductService} from "../../../_services/product/product.service";
import {OrderService} from "../../../_services/order/order.service";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {StatusService} from "../../../_services/status/status.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {ConfigOptions} from "../../../configOptions/config-options";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {Router} from "@angular/router";

export class Product {
  quantity: number;
  voucher: number;
  total?: number
}

@Component({
  selector: 'app-index-command',
  templateUrl: './index-command.component.html',
  styleUrls: ['./index-command.component.scss']
})
export class IndexCommandComponent implements OnInit, OnDestroy {

  title = 'Enregistrer nouvelle commande';
  clients: Client[] = [];
  client: Client;
  store: Store;
  showClientForm = false;
  orderForm: FormGroup;
  orF: any;
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  stores: Store[] = [];
  typeVoucher = [3000, 5000, 10000]
  tabProducts: Product[] = [];
  tabProd: Product;
  Products: Products[] = [];
  Product: Products = new Products();
  totalOrder: number = 0;
  totalTTC: number = 0;
  vouchers: TypeVoucher[] = [];
  load: boolean
  voucher: TypeVoucher = new TypeVoucher()
  orders: Order[] = [];
  filtredOrders: Order[] = [];
  order: Order = new Order();
  @ViewChild('orderModal', {static: false}) commandModal?: ElementRef<HTMLElement>;
  clientName = ''
  storeFilter = aesUtil.decrypt(key, localStorage.getItem('store'))
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
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  clientNotFound: boolean = false;
  onFilter: boolean = false;
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  private mySubscription3: Subscription;
  private mySubscription4: Subscription;
  private mySubscription5: Subscription;
  private mySubscription6: Subscription;
  private mySubscription7: Subscription;
  private mySubscription8: Subscription;
  minDate: string;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private clientService: ClientService,
              private voucherService: VoucherService, private notifsService: NotifsService, private storeService: StoreService,
              private productService: ProductService, private orderService: OrderService, private statusService: StatusOrderService,
              public global: ConfigOptions, private router: Router
  ) {
    this.formOrder();
    this.orF = this.orderForm.controls;
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key, authority));
    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  //initialisation de création du formulaire de commande

  formOrder() {
    this.orderForm = this.fb.group({
      client: ['', [Validators.required, Validators.minLength(3)]],
      // store: ['', [Validators.required, ]],
      chanel: ['', [Validators.required,]],
      quantity: ['', [Validators.required, Validators.pattern('^[1,2,3,4,5,6,7,8,9][0-9]*$')]],
      voucherType: ['', [Validators.required]],
      delais: ['',],
      description: ['',],
      refCli: ['',],
    });
  }

  ngOnInit(): void {
    // this.getClients()
    this.getTypeVoucher()
    this.getStores()
    this.getOrders()
  }

  getClients(): void {
    // this.clientService.getAllClients().subscribe(
    //   resp => {
    //     this.clients = resp.content;
    //   }
    // )
  }

  findClients(event: string): Client[] {
    if (event != '' && event.length >= 3) {
      this.mySubscription = this.clientService.searchClient(event).subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key, resp.key.toString()));
          if (!this.clients.length) {
            this.notifsService.onError('Ce client n\'existe pas', '')
            this.clientNotFound = true
          } else {
            this.clientNotFound = false
          }
        }
      )
    } else {
      this.clients = []
    }
    return this.clients
  }

  getStores() {
    this.mySubscription2 = this.storeService.getStore().subscribe(
      resp => {
        this.stores = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).content
      },
      error => {
        // this.notifsService.onError(error.error.message, 'échec chargement magasins')
      }
    )
  }

  getTypeVoucher(): void {
    this.load = true
    this.mySubscription3 = this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).content
        this.load = false
      }, error => {
        this.load = false
      }
    )
  }

  addProduct() {
    this.tabProd = new Product();
    this.tabProd.quantity = parseInt(this.orF['quantity'].value);
    this.tabProd.voucher = this.orF['voucherType'].value;
    this.tabProd.total = this.orF['quantity'].value * this.orF['voucherType'].value * 10;
    const prod = this.tabProducts.find(tb => tb.voucher == this.tabProd.voucher)
    const index = this.tabProducts.findIndex(client => client.voucher === this.tabProd.voucher);
    if (!prod) {
      this.tabProducts.push(this.tabProd)
    } else {
      prod.quantity += this.tabProd.quantity
      prod.total += this.tabProd.total
    }
    this.tabProducts[index] = prod
    this.orF['quantity'].clear;
    this.orF['voucherType'].clear
    this.totalOrder = 0;
    for (let prod of this.tabProducts) {
      this.totalOrder = this.totalOrder + prod.total
    }
    this.totalTTC = this.totalOrder
    this.orF['quantity'].reset();
    this.orF['voucherType'].reset();
  }

  removeProduct(index: Product) {
    this.tabProd = new Product()
    const prodIndex = this.tabProducts.indexOf(index)
    this.tabProducts.splice(prodIndex, 1)
    this.totalOrder = 0;
    for (let prod of this.tabProducts) {
      this.totalOrder = this.totalOrder + prod.total
    }
    this.totalTTC = this.totalOrder
  }

  showClientForms() {
    this.showClientForm = true;
    this.title = 'Enregistrer nouveau client';
  }

  showOrderForms() {
    this.showClientForm = false;
    this.title = 'Enregistrer nouvelle commande';
  }

  getOrders() {
    // let rout = aesUtil.encrypt(key, id.toString())
    // while (rout.includes('/')){
    //   rout = aesUtil.encrypt(key, id.toString())
    // }
    this.orderState$ = this.orderService.filterOrders$(
      this.storeFilter, this.clientName, this.date, this.internalRef, this.statusFilter,
      this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())))
          this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key, response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
    // this.orderState$ = this.orderService.orders$(this.page - 1, this.size)
    //   .pipe(
    //     map(response => {
    //       this.dataSubjects.next(response)
    //       console.log(response)
    //       this.orders = response.content
    //       this.filtredOrders = response.content.filter(order => order.store.internalReference == parseInt(localStorage.getItem('store')))
    //       this.notifsService.onSuccess('Chargement des commandes')
    //       return {dataState: DataState.LOADED_STATE, appData: response}
    //     }),
    //     startWith({dataState: DataState.LOADING_STATE, appData: null}),
    //     catchError((error: string) => {
    //       return of({dataState: DataState.ERROR_STATE, error: error})
    //     })
    //   )
  }

  filterOrders() {

    this.orderState$ = this.orderService.filterOrders$(
      this.storeFilter, this.clientName, this.date, this.internalRef, this.statusFilter,
      this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())))
          // this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key, response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }


  annuler() {
    this.formOrder();
    this.showOrderForms();
    this.modalService.dismissAll()
    this.tabProducts = []
    this.totalOrder = 0
    this.totalTTC = 0
    this.orF['client'].reset
  }

  annulerCommande() {
    this.showOrderForms();
  }

  saveOrder() {
    this.isLoading.next(true);
    //on récupère les informations du client
    this.client = this.findClients(this.orF['client'].value)[0]
    //on récupère les informations du magasin
    // this.store = this.findStore(this.orF['store'].value)[0]

    // this.order.idStore = this.store.internalReference
    this.order.idStore = localStorage.getItem("store").toString()
    this.order.idClient = aesUtil.encrypt(key, this.client.internalReference.toString()) as number
    this.order.channel = aesUtil.encrypt(key, this.orF['chanel'].value.toString())
    this.order.description = this.orF['description'].value != '' ? aesUtil.encrypt(key, this.orF['description'].value.toString()) : ''
    this.order.deliveryTime = this.orF['delais'].value != '' ? aesUtil.encrypt(key, this.orF['delais'].value.toString()) : ''
    this.order.clientReference = this.orF['refCli'].value != '' ? aesUtil.encrypt(key, this.orF['refCli'].value.toString()) as number : this.orF['refCli'].value
    this.order.idCommercialAttache = localStorage.getItem('uid').toString()
    this.order.tax = aesUtil.encrypt(key, this.global.tax.toString()) as number;
    this.order.ttcaggregateAmount = aesUtil.encrypt(key, this.totalTTC.toString()) as number;
    this.order.netAggregateAmount = aesUtil.encrypt(key,  this.totalOrder.toString()) as number;
    // console.log(this.order)
    if (this.client.completeName) {
      this.orderState$ = this.orderService.addOrder$(this.order)
        .pipe(
          map((response) => {
            // this.dataSubjects.next(
            //   {...this.dataSubjects.value , content: [response, ...this.dataSubjects.value.content]}
            // )
            this.isLoading.next(false)
            this.saveProductsOrder(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
            this.getProforma(JSON.parse(aesUtil.decrypt(key, response.key.toString())));
            this.annuler()
            this.getOrders()
            return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
          }),
          startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
          catchError((error: string) => {
            this.isLoading.next(false)
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )
    } else {
      this.notifsService.onWarning("Ce client n'existe pas")
    }

    //on enregistre une nouvelle commande
    // this.orderService.saveOrder(this.order).subscribe(
    //   resp => {
    //     this.isLoading.next(false);
    //     /**
    //      * je dois gérer cette partie
    //      */
    //     // this.orders.push(resp)
    //
    //     this.saveProductsOrder(resp)
    //     setTimeout(() => this.getProforma(resp) , 5000);
    //
    //     this.getOrders()
    //     this.notifsService.onSuccess('Nouvelle commande créée')
    //     this.tabProducts = []
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //     // this.notifsService.onError(error.error.message, 'erreur commande')
    //   }
    // )

  }

  async saveProductsOrder(order: Order) {
    //une fois la commande enregistrée, on enregistre les produits liés à cette commande
    for (let prod of this.tabProducts) {
      this.voucher = this.vouchers.find(v => v.amount == prod.voucher)
      this.Product.quantityNotebook = prod.quantity
      this.Product.idTypeVoucher = this.voucher.internalReference
      this.Product.idOrder = order.internalReference
      this.productService.saveProduct(this.Product).subscribe()
    }
  }

  async getProforma(order: Order) {
    this.orderService.getProforma(aesUtil.encrypt(key, order.internalReference.toString())).subscribe(
      respProd => {
        const file = new Blob([respProd], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
    )
  }

  openCommandModal(content: any) {
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-titles', size: 'xl',});
  }

  pageChange(event: number) {
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

  formatNumber(amount: any): string {
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1 ');
  }

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter) {
      this.statusFilter = '';
      this.clientName = '';
      this.storeFilter = aesUtil.decrypt(key, localStorage.getItem('store'))
      this.refCli = ''
      this.date = '';
      this.internalRef = ''
      this.filterOrders()
    }
  }

  findClientsForFilter(event: string): Client[] {
    if (event != '' && event.length >= 3) {
      this.mySubscription4 = this.clientService.searchClient(event).subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key, resp.key.toString()));
          if (this.clients.length <= 1) {
            this.filterOrders()
          }

          if (!JSON.parse(aesUtil.decrypt(key, resp.key.toString())).length) {
            this.notifsService.onError('Ce client n\'existe pas', '')
          }
        }
      )
    } else {
      if (this.clientName == '') {
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
    this.mySubscription3 ? this.mySubscription3.unsubscribe() : null;
    this.mySubscription4 ? this.mySubscription4.unsubscribe() : null;
  }
}
