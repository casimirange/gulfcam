import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OrderService} from "../../../_services/order/order.service";
import {Order} from "../../../_model/order";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {ClientService} from "../../../_services/clients/client.service";
import {Client, TypeClient} from "../../../_model/client";
import {Store} from "../../../_model/store";
import {ProductService} from "../../../_services/product/product.service";
import {Products} from "../../../_model/products";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {PaiementService} from "../../../_services/paiement/paiement.service";
import {PaiementMethod} from "../../../_model/paiement";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {catchError, filter, map, startWith} from "rxjs/operators";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {LoaderComponent} from "../../../preloader/loader/loader.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfigOptions} from "../../../configOptions/config-options";
import {aesUtil, key} from "../../../_helpers/aes.js";

export class Product {
  coupon: number;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  order: Order = new Order();
  vouchers: TypeVoucher[] = []
  voucher: TypeVoucher = new TypeVoucher()
  voucherAmount: number
  listVouchers: number[] = []
  client: Client = new Client();
  store: Store = new Store();
  products: Products[] = []
  paymentMethods: PaiementMethod[] = []
  load: boolean
  paymentMethod: PaiementMethod = new PaiementMethod()
  statut: string;
  clientid: string;
  storeid: string;
  payid: string;
  editForm: FormGroup;
  selectPdfForm: FormGroup;
  selectedFiles: FileList;
  currentFileUpload: File;
  addCouponClientForm: FormGroup;
  orF: any;
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  stores: Store[] = [];
  typeVoucher = [3000, 5000, 10000]
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString());
  role: string[] = [];
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private isVerifying = new BehaviorSubject<boolean>(false);
  isVerifying$ = this.isVerifying.asObservable();
  private isCanceling = new BehaviorSubject<boolean>(false);
  isCanceling$ = this.isCanceling.asObservable();
  private loadingFile = new BehaviorSubject<boolean>(false);
  loadingFile$ = this.loadingFile.asObservable();
  private IdParam: string;
  orderState$: Observable<AppState<Order>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<Order>(null);
  idmanager = localStorage.getItem('uid')
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  private mySubscription3: Subscription;
  private mySubscription4: Subscription;
  private mySubscription5: Subscription;
  private mySubscription6: Subscription;
  private mySubscription7: Subscription;
  private mySubscription8: Subscription;
  constructor(private orderService: OrderService, private notifsService: NotifsService, private route: ActivatedRoute,
              private clientService: ClientService, private storeService: StoreService, private productService: ProductService,
              private voucherService: VoucherService, private paymentService: PaiementService, private fb: FormBuilder,
              private statusService: StatusOrderService, private couponService: CouponService, private router: Router,
              private modalService: NgbModal, public global: ConfigOptions, private activatedRoute: ActivatedRoute) {
    this.formOrder()
    this.formAddCarnet()
    this.orF = this.addCouponClientForm.controls;
    this.selectPdfForm = this.fb.group({
      pdf: ['']
    });
    this.activatedRoute.params.subscribe(params => {
      this.IdParam = params['id'];
    })

    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    // this.getVouchers()
    // this.getProductsByOrder()
    this.getPaymentMethods()
    // this.getClientByOrder()
    // this.getStoreByOrder()
    // this.getPaymentMethodByOrder()
    this.getOrder()
  }

  formOrder() {
    this.editForm = this.fb.group({
      method: ['', [Validators.required]],
      peimentRef: ['', [Validators.required, Validators.minLength(3)]],
      file: ['', [Validators.required]],
      fileBordereau: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });
  }

  formAddCarnet() {
    this.addCouponClientForm = this.fb.group({
      coupon: ['', [Validators.required,]]
    });
  }

  getOrder() {
    this.activatedRoute.params.subscribe(params => {
      this.orderState$ = this.orderService.showOrder$(params['id'])
        .pipe(
          map((response) => {
            // console.log(JSON.parse(aesUtil.decrypt(key, response.key.toString())))
            this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())))
            this.order = JSON.parse(aesUtil.decrypt(key, response.key.toString()) )as Order
            this.statut = JSON.parse(aesUtil.decrypt(key, response.key.toString())).status.name
            // this.clientid = JSON.parse(aesUtil.decrypt(key, response.key.toString())).idClient
            // this.storeid = JSON.parse(aesUtil.decrypt(key, response.key.toString())).idStore
            // this.payid = JSON.parse(aesUtil.decrypt(key, response.key.toString())).idPaymentMethod

            // this.getClientByOrder(JSON.parse(aesUtil.decrypt(key, response.key.toString())).idClient.toString())
            // this.getStoreByOrder(JSON.parse(aesUtil.decrypt(key, response.key.toString())).idClient.toString())
            // if (this.payid.toString() != ''){
            //   this.getPaymentMethodByOrder(JSON.parse(aesUtil.decrypt(key, response.key.toString())).idClient.toString())
            // }
            return {
              dataState: DataState.LOADED_STATE,
              appData: JSON.parse(aesUtil.decrypt(key, response.key.toString()))
            }
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )
    })

    // this.loadingData.next(true)
    //   this.orderService.getOrderByRef(parseInt(this.IdParam)).subscribe(
    //     resp => {
    //       this.order = resp
    //       this.statut = this.order.status.name
    //       this.loadingData.next(false)
    //       this.clientService.findClient(this.order.idClient).subscribe(
    //         resp => {
    //           this.client = resp;
    //         }
    //       )
    //       this.storeService.getStoreByInternalref(this.order.idStore).subscribe(
    //         resp => {
    //           this.store = resp
    //         }
    //       )
    //     },
    //   )
  }

  getProductsByOrder() {
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProducts(aesUtil.decrypt(key, params['id'].toString())).subscribe(
        resp => {
          this.products = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).content
        }
      )
    })
  }

  getClientByOrder(id: string) {
    if (id != ''){
      this.clientService.findClient(aesUtil.encrypt(key, id.toString())).subscribe(
        resp => {
          this.client = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
        }
      )
    }

  }

  getStoreByOrder(id: string) {
    if(id != ''){
      this.storeService.getStoreByInternalref(aesUtil.encrypt(key, id.toString())).subscribe(
        resp => {
          this.store = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
        }
      )
    }

  }

  getPaymentMethodByOrder(id: string) {
    if (id != ''){
      this.paymentService.getPaiementMethodByInternalRef(aesUtil.encrypt(key, id.toString())).subscribe(
        resp => {
          this.paymentMethod = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
        }
      )
    }

  }

  getPaymentMethods() {
    this.load = true
    this.mySubscription = this.paymentService.getPaymentMethods().subscribe(
      resp => {
        this.paymentMethods = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.load = false
      },
    )
  }

  acceptOrder() {
    if (this.selectedFiles.item(0).type == 'application/pdf') {
      this.isLoading.next(true);
      this.order.idFund = this.idmanager
      let rout = aesUtil.encrypt(key, this.editForm.controls['method'].value.toString())
      while (rout.includes('/') || rout.includes('&')){
        rout = aesUtil.encrypt(key, this.editForm.controls['method'].value.toString())
      }
      this.order.idPaymentMethod = rout
      this.order.paymentReference = this.editForm.controls['peimentRef'].value
      const docType = 'pdf'
      this.currentFileUpload = this.selectedFiles.item(0);
      this.orderService.acceptOrder(this.IdParam, this.order.idFund, this.order.idPaymentMethod, this.order.paymentReference,
        docType, this.currentFileUpload).subscribe(
        resp => {
          this.isLoading.next(false);
          this.notifsService.onSuccess('Commande Acceptée')
          this.generateReçu()
          this.refreshOrder()
          this.editForm.reset()
          this.formOrder()
        }, error => {
          this.isLoading.next(false)
        }
      )
    } else {
      this.notifsService.onWarning('vous devez importer un fichier PDF')
    }
  }

  endOrder() {
    if (this.selectedFiles.item(0).type == 'application/pdf') {
      this.isLoading.next(true);
      this.order.idSalesManager = this.idmanager
      this.currentFileUpload = this.selectedFiles.item(0);
      this.orderService.validOrder(this.IdParam, this.order.idSalesManager, this.currentFileUpload).subscribe(
        resp => {
          this.isLoading.next(false);
          this.notifsService.onSuccess('Commande Terminée')
          this.refreshOrder()
          this.editForm.controls['fileBordereau'].reset()
        }, error => {
          this.isLoading.next(false)
        }
      )
    } else {
      this.notifsService.onWarning('vous devez importer un fichier PDF')
    }
  }

  payOrder() {
    this.order.idSalesManager = this.idmanager
    this.isLoading.next(true);
    this.orderService.payOrder(this.IdParam, this.order.idSalesManager).subscribe(
      resp => {
        this.isLoading.next(false);
        this.refreshOrder()
        this.notifsService.onSuccess('Commande Payée')
      },
      error => {
        this.isLoading.next(false);
      }
    )

  }

  generateBoredereau() {
    if (this.statut == "PAID") {
      this.isLoading.next(true);
      this.order.idSalesManager = this.idmanager
      this.orderService.deliveryOrder(this.IdParam, this.order.idSalesManager).subscribe(
        response => {
          // console.log('delivery', respProd)
          const file = new Blob([response], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.isLoading.next(false);
          this.notifsService.onSuccess('Commande en cours de livraison')
          this.refreshOrder()
          // this.isLoading.next(false);
        },
        error => {
          this.isLoading.next(false);
        }
      )
    }
  }

  getBoredereau() {
    const type = 'DELIVERY'
    this.orderService.getReçu(this.IdParam, type).subscribe(
      response=> {
        const file = new Blob([response], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        // this.isLoading.next(false);
      },
    )
  }

  refreshOrder() {
    // this.orderState$ = this.orderService.showOrder$(parseInt(this.IdParam))
    //   .pipe(
    //     map((response) => {
    //       this.dataSubjects.next(response)
    //       this.order = response
    //       this.statut = response.status.name
    //       return {dataState: DataState.LOADED_STATE, appData: response}
    //     }),
    //     startWith({dataState: DataState.LOADED_STATE, appData: null}),
    //     catchError((error: string) => {
    //       return of({dataState: DataState.ERROR_STATE, error: error})
    //     })
    //   )

    this.orderState$ = this.orderService.showOrder$(this.IdParam)
      .pipe(
        map((response) => {
          // console.log(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.order = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
          this.statut = JSON.parse(aesUtil.decrypt(key,response.key.toString())).status.name
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  selectFile(event) {
    const file = event.target.files;
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 1 * 1024 * 1024; // 10MB

    if (fileSizeInBytes > maxSizeInBytes) {
      // Afficher une erreur ou prendre une action appropriée
      console.log("La taille du fichier dépasse la limite maximale autorisée.");
    } else {
      // Le fichier est dans les limites de taille acceptables, poursuivre le traitement

      this.selectedFiles = event.target.files;
    }
  }

  getProforma() {
    this.openLoader()
    this.mySubscription2 = this.orderService.getProforma(this.IdParam).subscribe(
      response => {
        this.closeLoader()
        const file = new Blob([response], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, error => {
        this.closeLoader()
      }
    )
  }

  generatePreuve() {
    const docType = 'pdf'
    const type = 'INVOICE'
    this.openLoader()
    this.mySubscription3 = this.orderService.getFile(this.IdParam, type, docType).subscribe(
      response => {
        this.closeLoader()
        const file = new Blob([response], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, error => {
        this.closeLoader()
      }
    )
  }

  generateReçu() {
    this.loadingFile.next(true)
    this.openLoader()
    const type = 'INVOICE'
    this.mySubscription4 = this.orderService.getReçu(this.IdParam, type).subscribe(
      response => {
        this.loadingFile.next(false)
        this.closeLoader()
        const file = new Blob([response], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, error => {
        this.loadingFile.next(false)
        this.closeLoader()
      }
    )
  }

  generateBonLivraison() {
    const type = 'DELIVERY'
    this.openLoader()
    this.mySubscription5 = this.orderService.getReçu(this.IdParam, type).subscribe(
      response => {
        this.closeLoader()
        const file = new Blob([response], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, error => {
        this.closeLoader()
      }
    )
  }

  generateBonCommande() {
    const docType = 'pdf'
    const type = 'DELIVERY'
    this.openLoader()
    // let rout = aesUtil.encrypt(key, this.order.internalReference.toString())
    // while (rout.includes('/')){
    //   rout = aesUtil.encrypt(key, this.order.internalReference.toString())
    // }
    this.mySubscription6 = this.orderService.getFile(this.IdParam, type, docType).subscribe(
      response => {
        this.closeLoader()
        const file = new Blob([response], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        // this.isLoading.next(false);
      },
      error => {
        this.closeLoader()
      }
    )
  }

  deny(order: Order) {

    Swal.fire({
      title: 'Annuler commande',
      html: "Voulez-vous vraiment annuler la commande N° " + order.internalReference.toString().bold() + " ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00ace6',
      cancelButtonColor: '#f65656',
      confirmButtonText: 'OUI',
      cancelButtonText: 'NON',
      allowOutsideClick: true,
      focusConfirm: false,
      focusCancel: true,
      focusDeny: true,
      backdrop: `rgba(0, 0, 0, 0.4)`,
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        this.denyOrder()
      }
    })

  }

  denyOrder() {
    if (this.editForm.controls['reason'].value.toString() == '') {
      this.notifsService.onError('veuillez préciser la raison d\'annulation de la commande', '')
    } else {
      this.isCanceling.next(true)
      this.order.idCommercialAttache = localStorage.getItem('uid')
      this.order.reasonForCancellation = this.editForm.controls['reason'].value
      this.orderService.denyOrder(this.IdParam, this.order.idCommercialAttache, this.order.reasonForCancellation).subscribe(
        res => {
          this.isCanceling.next(false)
          this.notifsService.onSuccess('commande annulée avec succès')
          this.refreshOrder()
        },error => {
          this.isCanceling.next(false)
        }

      );

    }
  }

  affectCouponClient() {
    this.isLoading.next(true)
    this.listVouchers.forEach(coupon => {
      let cp = coupon.toString()
      let rout = aesUtil.encrypt(key, cp.toString())
      while (rout.includes('/')){
        rout = aesUtil.encrypt(key, cp.toString())
      }
      let rout2 = aesUtil.encrypt(key, this.order.client.internalReference.toString())
      while (rout2.includes('/') || rout2.includes('&')){
        rout2 = aesUtil.encrypt(key, this.order.client.internalReference.toString())
      }
      this.couponService.affectCouponClient(rout, rout2).subscribe();
    })
    this.notifsService.onSuccess('carnet(s) attribué(s) avec succès')
    this.orF['coupon'].reset();
    this.listVouchers = []
    this.isLoading.next(false)

  }

  generatePDF($event) {
    const select = $event.target.value
    // if (select == 'facture'){
    //   this.getProforma();
    // }
    // if (select == 'proforma'){
    //   this.getProforma();
    // }
    switch (select) {
      case 'bordereau':
        this.generateBonLivraison();
        break;
      case 'preuve':
        this.generatePreuve();
        break;
      case 'préfacture':
        this.getProforma();
        break;
      case 'bonCommand':
        this.generateBonCommande();
        break;
      case 'reçu':
        this.generateReçu();
        break;
      case 'bonLivraison':
        this.generateBonLivraison();
        break;
    }
    // if (select == 'bordereau'){
    //
    // }
    // if (select == 'preuve'){
    //   this.generatePreuve()
    // }
    // if (select == 'préfacture'){
    //   this.getProforma();
    // }
    // if (select == 'bonCommand'){
    //   this.generateBonCommande();
    // }
  }


  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  addCoupon() {
    this.isVerifying.next(true)
    let str = parseInt(this.addCouponClientForm.controls['coupon'].value).toString();
    let rout = aesUtil.encrypt(key, str.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, str.toString())
    }
    this.mySubscription8 = this.couponService.getCouponsBySerialNumber(rout.toString()).subscribe(
      res => {
        if (JSON.parse(aesUtil.decrypt(key,res.key.toString())).status.name !== 'AVAILABLE') {
          this.notifsService.onWarning('Ce coupon n\'une plus dans notre espace de stockage')
        } else {
          this.listVouchers.push(+str)
          this.addCouponClientForm.controls['coupon'].reset()
        }
        this.isVerifying.next(false)
      }, error => {
        this.notifsService.onError("Ce coupon n'existe pas", '')
        this.isVerifying.next(false)
      }
    )
  }

  removeCoupon(coupon: number) {
    const prodIndex = this.listVouchers.indexOf(coupon)
    this.listVouchers.splice(prodIndex, 1)
  }

  openLoader() {
    this.modalService.open(LoaderComponent, {backdrop: false});
  }

  closeLoader() {
    this.modalService.dismissAll()
  }

  formatNumber(amount: any): string {
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1 ');
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
    this.mySubscription3 ? this.mySubscription3.unsubscribe() : null;
    this.mySubscription4 ? this.mySubscription4.unsubscribe() : null;
    this.mySubscription5 ? this.mySubscription5.unsubscribe() : null;
    this.mySubscription6 ? this.mySubscription6.unsubscribe() : null;
    this.mySubscription8 ? this.mySubscription8.unsubscribe() : null;
  }
}
