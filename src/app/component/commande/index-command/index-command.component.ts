import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {BehaviorSubject, Observable, of} from "rxjs";
import {StatusService} from "../../../_services/status/status.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {ConfigOptions} from "../../../configOptions/config-options";
export class Product{
  quantity: number;
  voucher: number;
  total?: number
}
@Component({
  selector: 'app-index-command',
  templateUrl: './index-command.component.html',
  styleUrls: ['./index-command.component.scss']
})
export class IndexCommandComponent implements OnInit {

  title = 'Enregistrer nouvelle commande';
  clients: Client[] = [];
  client: Client;
  store: Store;
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
  totalOrder: number = 0;
  totalTTC: number = 0;
  vouchers: TypeVoucher[] = [];
  voucher: TypeVoucher = new TypeVoucher()
  orders: Order[] = [];
  order: Order = new Order();
  @ViewChild('orderModal', { static: false }) commandModal?: ElementRef<HTMLElement>;
  name = ''
  refCli = ''
  date = ''
  internalRef = ''
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  orderState$: Observable<AppState<CustomResponse<Order>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Order>>(null);
  private isSearching = new BehaviorSubject<boolean>(false);
  isSearching$ = this.isSearching.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  roleUser = localStorage.getItem('userAccount').toString()
  constructor(private fb: FormBuilder, private modalService: NgbModal, private clientService: ClientService,
              private voucherService: VoucherService, private notifsService: NotifsService, private storeService: StoreService,
              private productService: ProductService, private orderService: OrderService, private statusService: StatusOrderService,
              public global: ConfigOptions
  ) {
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
      phone: ['', [Validators.required]],
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
      delais: ['',],
      description: ['',],
      refCli: ['', ],
    });
  }

  ngOnInit(): void {
    this.getClients()
    this.getTypeVoucher()
    this.getStores()
    this.getOrders()
  }

  getClients(): void{
    this.clientService.getAllClients().subscribe(
      resp => {
        this.clients = resp.content;
      }
    )
  }

  findClients(event: string): Client[]{
    console.log(event)
    if (event != '' && event.length >= 3){
      this.clientService.searchClient(event) .subscribe(
        resp => {
          this.clients = resp;
          console.log(resp)
        }
      )
    }else {
      this.clients = []
    }
    return this.clients
  }

  findStore(event: string): Store[]{
    if (event != '' && event.length >= 3){
      this.storeService.searchStore(event) .subscribe(
        resp => {
          this.stores = resp;
        }
      )
    }else {
      this.stores = []
    }
    return this.stores

  }

  getStores(){
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
      error => {
        // this.notifsService.onError(error.error.message, 'échec chargement magasins')
      }
    )
  }

  getTypeVoucher(): void{
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = resp.content
      }
    )
  }

  addProduct(){
    this.tabProd = new Product();
    this.tabProd.quantity = parseInt(this.orF['quantity'].value);
    this.tabProd.voucher = this.orF['voucherType'].value;
    this.tabProd.total = this.orF['quantity'].value * this.orF['voucherType'].value * 10;
    const prod = this.tabProducts.find(tb => tb.voucher == this.tabProd.voucher)
    const index = this.tabProducts.findIndex(client => client.voucher === this.tabProd.voucher);
      if (!prod){
        this.tabProducts.push(this.tabProd)
      }else {
        prod.quantity += this.tabProd.quantity
        prod.total += this.tabProd.total
      }
    this.tabProducts[index] = prod
    this.orF['quantity'].clear; this.orF['voucherType'].clear
    this.totalOrder = 0;
    for(let prod of this.tabProducts){
      this.totalOrder = this.totalOrder + prod.total
    }
    this.totalTTC = this.totalOrder * this.global.tax + this.totalOrder
    this.orF['quantity'].reset();
    this.orF['voucherType'].reset();
  }

  removeProduct(index: Product){
    this.tabProd = new Product()
    const prodIndex = this.tabProducts.indexOf(index)
    this.tabProducts.splice(prodIndex, 1)
    this.totalOrder = 0;
    for(let prod of this.tabProducts){
      this.totalOrder = this.totalOrder + prod.total
    }
    this.totalTTC = this.totalOrder * this.global.tax + this.totalOrder
  }

  showClientForms(){
    this.showClientForm = true;
    this.title = 'Enregistrer nouveau client';
  }

  showOrderForms(){
    this.showClientForm = false;
    this.title = 'Enregistrer nouvelle commande';
  }


  saveClientt(){
    this.client = this.clientForm.value
    this.client.phone = this.clientForm.controls['phone'].value.e164Number
    this.clientService.addClient(this.client).subscribe(
      resp => {
        this.clients.push(resp)
        this.notifsService.onSuccess('client rajouté avec succès')
        this.showOrderForms();
        this.annulerCommande()
      },
      err => {
        // this.notifsService.onError(err.error.message, 'échec d\'enregistrement')
      }
    )
  }

  getOrders(){
    this.orderState$ = this.orderService.orders$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }


  annuler() {
    this.formOrder();
    this.formClient();
    this.showOrderForms();
    this.modalService.dismissAll()
  }

  annulerCommande() {
    this.formClient();
    this.showOrderForms();
  }

  saveOrder(){
    this.isLoading.next(true);
    //on récupère les informations du client
      this.client = this.findClients(this.orF['client'].value)[0]
    //on récupère les informations du magasin
    this.store = this.findStore(this.orF['store'].value)[0]

    this.order.idStore = this.store.internalReference
    this.order.idClient = this.client.internalReference
    this.order.channel = this.orF['chanel'].value
    this.order.description = this.orF['description'].value
    this.order.deliveryTime = this.orF['delais'].value
    this.order.clientReference = this.orF['refCli'].value
    this.order.idManagerOrder = parseInt(localStorage.getItem('uid'))
    this.order.tax = this.global.tax;
    this.order.ttcaggregateAmount = this.totalOrder * this.order.tax + this.totalOrder;
    this.order.netAggregateAmount = this.totalOrder;


    this.orderState$ = this.orderService.addOrder$(this.order)
      .pipe(
        map((response ) => {
          // this.dataSubjects.next(
          //   {...this.dataSubjects.value , content: [response, ...this.dataSubjects.value.content]}
          // )
          this.isLoading.next(false)
          this.getOrders()
          this.saveProductsOrder(response)
          setTimeout(() => this.getProforma(response) , 1000);
          this.tabProducts = []
          this.annuler()
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )


    //on enregistre une nouvelle commande
    // this.orderService.saveOrder(this.order).subscribe(
    //   resp => {
    //     console.log(resp)
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

  saveProductsOrder(order: Order){
    //une fois la commande enregistrée, on enregistre les produits liés à cette commande
    for(let prod of this.tabProducts){
      this.voucher = this.vouchers.find(v => v.amount == prod.voucher)
      this.Product.quantityNotebook = prod.quantity
      this.Product.idTypeVoucher = this.voucher.internalReference
      this.Product.idOrder = order.internalReference
      this.productService.saveProduct(this.Product).subscribe()
    }
  }

  getProforma(order: Order){
    this.orderService.getProforma(order.internalReference).subscribe(
      respProd => {
        const file = new Blob([respProd], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
    )
  }

  openCommandModal(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-titles', size: 'xl', });
  }

  pageChange(event: number){
    this.page = event
    this.orderState$ = this.orderService.orders$(this.page - 1, this.size)
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
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }
}
