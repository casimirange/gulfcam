import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {Unite} from "../../../_model/unite";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreService} from "../../../_services/store/store.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UnitsService} from "../../../_services/units/units.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import Swal from "sweetalert2";
import {ClientService} from "../../../_services/clients/client.service";
import {Client} from "../../../_model/client";
import {RequestOpposition} from "../../../_model/requestOpposition";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_model/user";
import {OppositionService} from "../../../_services/opposition/opposition.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {StatusService} from "../../../_services/status/status.service";
import {ISignup} from "../../../_model/signup";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-index-request-opposition',
  templateUrl: './index-request-opposition.component.html',
  styleUrls: ['./index-request-opposition.component.scss']
})
export class IndexRequestOppositionComponent implements OnInit, OnDestroy {

  requestForm: FormGroup;
  stores: Store[] = [];
  users: ISignup[] = [];
  usersCA: ISignup[] = [];
  store: Store = new Store();
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  requestOpposition: RequestOpposition = new RequestOpposition();
  requestOppositions: RequestOpposition[] = [];
  unit: Unite = new Unite();
  clients: Client[]
  vouchers: number[] = []
  vouchers1: string[] = []
  appState$: Observable<AppState<CustomResponse<RequestOpposition>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<RequestOpposition>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouvelle requête';
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  clientName = '';
  statusFilter = '';
  saleManagerFilter = '';
  attacheComFilter = '';
  date = '';
  private clientNotFound: boolean;
  onFilter = false;
  idmanager = localStorage.getItem('uid')
  private isVerifying = new BehaviorSubject<boolean>(false);
  isVerifying$ = this.isVerifying.asObservable();
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  private mySubscription3: Subscription;
  private mySubscription4: Subscription;
  private mySubscription5: Subscription;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService, private router: Router,
              private notifService: NotifsService, private unitService: UnitsService, private voucherService: VoucherService,
              private clientService: ClientService, private userService: UsersService, private requestService: OppositionService,
              private statusService: StatusService, private couponService: CouponService) {
    this.formRequest();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    // this.getClients();
    this.getUsers();
    this.getUsersCA();
    this.getRequests();
  }

  //initialisation du formulaire de création type de bon
  formRequest() {
    this.requestForm = this.fb.group({
      idClient: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      // idManagerCoupon: ['', ],
      serialNumber: ['', [Validators.required, Validators.pattern('^[0-9]*'),]],
    });
  }

  //ouverture du modal
  open(content: any) {
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  createRequest() {
    this.requestOpposition.reason = aesUtil.encrypt(key, this.requestForm.controls['reason'].value.toString())
    this.requestOpposition.description = aesUtil.encrypt(key, this.requestForm.controls['description'].value.toString())
    this.requestOpposition.idCommercialAttache = this.idmanager
    this.requestOpposition.idClient = aesUtil.encrypt(key, this.clients.find(client => client.completeName === this.requestForm.controls['idClient'].value).internalReference.toString())
    // this.requestOpposition.idSalesManager = parseInt(this.requestForm.controls['idManagerCoupon'].value)
    // console.log("vouchers", this.vouchers)
    this.requestOpposition.serialCoupons = this.vouchers1
    // this.vouchers.forEach(value => {
    //   let client = this.clients.find(client => client.completeName === this.requestForm.controls['idClient'].value)
    //   this.couponService.getCouponsBySerialNumber(value.toString()).subscribe(
    //     res => {
    //       if (res.idClient != client.internalReference) {
    //         this.notifService.onWarning(`le coupon ${value} n'appartient pas à ce client`)
    //       }else {
    //         this.requestOpposition.serialCoupons.push(value)
    //       }
    //     },
    //   )
    // })
    // this.requestOpposition.serialCoupons = this.vouchers
    this.isLoading.next(true);
    // console.log('demande d\'opposition', this.requestOpposition)
    this.requestService.saveOppositionRequest(this.requestOpposition).subscribe(
      resp => {
        // this.requestOppositions.push(resp)
        this.getRequests()
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('enregistrement effectué')
      },
      error => {
        this.notifService.onError(error.error.message, '')
        this.isLoading.next(false);
      }
    )
  }

  getRequests() {
    this.appState$ = this.requestService.requests$(this.page - 1, this.size, this.clientName, this.date, this.statusFilter, this.attacheComFilter, this.saleManagerFilter)
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
    // this.requestService.getOppositionRequest(this.page - 1, this.size).subscribe(
    //   resp => {
    //     this.requestOppositions = resp.content
    //     // this.size = resp.size
    //     this.totalPages = resp.totalPages
    //     this.totalElements = resp.totalElements
    //     this.notifService.onSuccess('Liste des demandes d\'opposition')
    //   },
    // )
  }

  filterRequests() {
    this.requestService.filterOppositionRequest(this.page - 1, this.size, this.clientName, this.date, this.statusFilter).subscribe(
      resp => {
        this.requestOppositions = resp.content
        // this.size = resp.size
        this.totalPages = resp.totalPages
        this.totalElements = resp.totalElements
      },
    )
  }

  getClients() {
    this.clientService.getAllClients().subscribe(
      resp => {
        this.clients = resp.content
      },
    )
  }

  findClients(event: string): Client[]{
    if (event != '' && event.length >= 3){
      this.mySubscription5 = this.clientService.searchClient(event) .subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
          if (!JSON.parse(aesUtil.decrypt(key,resp.key.toString())).length){
            this.notifService.onError('Ce client n\'existe pas', '')
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

  getUsers() {
    const type = 'SALES_MANAGER'
    this.mySubscription3 = this.userService.getUsersByTypeAccount(type).subscribe(
      resp => {
        this.users = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))
      },
    )
  }

  getUsersCA() {
    const type = 'COMMERCIAL_ATTACHE'
    this.mySubscription4 = this.userService.getUsersByTypeAccount(type).subscribe(
      resp => {
        this.usersCA = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))
      },
    )
  }

  annuler() {
    this.formRequest();
    this.store = new Store()
    this.modalService.dismissAll()
    this.vouchers = []
    this.vouchers1 = []
  }

  updateStoreModal(mymodal: TemplateRef<any>, store: RequestOpposition) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    this.requestOpposition = store
    this.modalTitle = 'Modifier requête'
  }

  updateRequest() {
    this.isLoading.next(true);
    // this.storeService.updateStore(this.requestForm.value, this.store.internalReference).subscribe(
    //   resp => {
    //     this.isLoading.next(false);
    //     const index = this.stores.findIndex(store => store.internalReference === resp.internalReference);
    //     this.stores[ index ] = resp;
    //     this.notifService.onSuccess("requête modifiée avec succès!")
    //     this.annuler()
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //   }
    // )
  }

  // showDetails(store: Store) {
  //   this.router.navigate(['/entrepots/details', store.internalReference])
  // }

  // findClients(event: any): void {
  //   this.clientService.searchClient(event).subscribe(
  //     resp => {
  //       this.clients = resp;
  //     }, error => {
  //       this.clients = []
  //     }
  //   )
  // }

  addCoupon() {
    // let str= this.requestForm.controls['serialNumber'].value.toString();
    this.isVerifying.next(true)
    let str = parseInt(this.requestForm.controls['serialNumber'].value.toString());
    let rout = aesUtil.encrypt(key, str.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, str.toString())
    }
    let client;
    if (this.requestForm.controls['idClient'].value) {
      client = this.clients.find(client => client.completeName === this.requestForm.controls['idClient'].value)
      this.mySubscription = this.couponService.getCouponsBySerialNumber(rout).subscribe(
        res => {
          // this.isVerifying.next(false)
          if (JSON.parse(aesUtil.decrypt(key,res.key.toString())).status.name === 'ACTIVATED') {
            if (JSON.parse(aesUtil.decrypt(key,res.key.toString())).idClient === client.internalReference) {
              this.vouchers.push(this.requestForm.controls['serialNumber'].value)
              this.vouchers1.push(rout)
              // console.log('coupons', this.vouchers1)
              this.requestForm.controls['serialNumber'].reset()
              this.isVerifying.next(false)
            } else {
              this.notifService.onWarning('Ce coupon n\'appartient pas à ce client')
              this.isVerifying.next(false)
            }
          } else {
            this.isVerifying.next(false)
            this.notifService.onWarning(`Seuls les coupons activés peuvent être utilisés. statut du coupon: ${this.getStatuts(JSON.parse(aesUtil.decrypt(key,res.key.toString())).status.name)}`)
          }
        }, error => {
          this.isVerifying.next(false)
          this.notifService.onError("Ce coupon n'existe pas", '')
        }
      )
    } else {
      this.notifService.onWarning('Veuillez sélectionner un client')
      this.isVerifying.next(false)
    }
  }

  removeCoupon(coupon: number) {
    const prodIndex = this.vouchers.indexOf(coupon)
    const prodIndex2 = this.vouchers1.indexOf(aesUtil.decrypt(key, coupon.toString()))
    this.vouchers.splice(prodIndex, 1)
    this.vouchers1.splice(prodIndex2, 1)
  }

  requestDetails(request: RequestOpposition) {
    let rout = aesUtil.encrypt(key, request.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, request.internalReference.toString())
    }
    this.router.navigate(['/request-opposition/details', rout])
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number) {
    this.page = event
    this.getRequests()
  }

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter) {
      this.date = '';
      this.clientName = '';
      this.statusFilter = '';
      this.attacheComFilter = '';
      this.saleManagerFilter = '';
      this.getRequests()
    }
  }

  findClientsForFilter(event: string): Client[]{
    if (event != '' && event.length >= 3){
      this.mySubscription2 = this.clientService.searchClient(event) .subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
          if (this.clients.length <= 1){
            this.getRequests()
          }

          if (!JSON.parse(aesUtil.decrypt(key,resp.key.toString())).length){
            this.notifService.onError('Ce client n\'existe pas', '')
          }
        }
      )
    }else {
      if (this.clientName == ''){
        this.getRequests()
      }
      this.clients = []
    }
    return this.clients
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
    this.mySubscription3 ? this.mySubscription3.unsubscribe() : null;
    this.mySubscription4 ? this.mySubscription4.unsubscribe() : null;
    this.mySubscription5 ? this.mySubscription5.unsubscribe() : null;
  }
}
