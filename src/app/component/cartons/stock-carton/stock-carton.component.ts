import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StoreHouse} from "../../../_model/storehouse";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {StoreService} from "../../../_services/store/store.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import Swal from "sweetalert2";
import {CartonService} from "../../../_services/cartons/carton.service";
import {Carton} from "../../../_model/carton";
import {CarnetService} from "../../../_services/carnets/carnet.service";
import {Carnet} from "../../../_model/carnet";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {Coupon} from "../../../_model/coupon";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {Stock} from "../../../_model/stock";
import {MvtStockService} from "../../../_services/stock/mvt-stock.service";
import {StatusService} from "../../../_services/status/status.service";
import {catchError, map, startWith} from "rxjs/operators";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Client} from "../../../_model/client";
import {DataState} from "../../../_enum/data.state.enum";
import {UsersService} from "../../../_services/users/users.service";
import {ISignup} from "../../../_model/signup";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-stock-carton',
  templateUrl: './stock-carton.component.html',
  styleUrls: ['./stock-carton.component.scss']
})
export class StockCartonComponent implements OnInit, OnDestroy {

  storeHouses: StoreHouse[] = [];
  storeHousesAdmin: StoreHouse[] = [];
  storeHouse: StoreHouse = new StoreHouse();
  cartons: Carton[] = [];
  carton: Carton = new Carton();
  carnet: Carnet = new Carnet();
  coupon: Coupon = new Coupon();
  mvtStock: Stock = new Stock();
  vouchers: TypeVoucher[] = [];
  users: ISignup[] = [];
  load: boolean
  @ViewChild('mymodal', {static: false}) viewMe?: ElementRef<HTMLElement>;
  cartonForm: FormGroup;
  storeHouseType = ['stockage', 'vente']
  stores: Store[] = [];
  store: Store = new Store();
  private isLoadingDataStore = new BehaviorSubject<boolean>(false);
  isLoadingDataStore$ = this.isLoadingDataStore.asObservable();
  private isLoadingDataVoucher = new BehaviorSubject<boolean>(false);
  isLoadingDataVoucher$ = this.isLoadingDataVoucher.asObservable();
  private isLoadingDataStoreHouse = new BehaviorSubject<boolean>(false);
  isLoadingDataStoreHouse$ = this.isLoadingDataStoreHouse.asObservable();
  private isLoadingDataCarton = new BehaviorSubject<boolean>(false);
  isLoadingDataCarton$ = this.isLoadingDataCarton.asObservable();
  appState$: Observable<AppState<CustomResponse<Carton>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Carton>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer un nouveau carton'
  magasin: string
  entrepot: string;
  sctd: number;
  sctf: number;
  scpd: number;
  scpf: number;
  nc: number;
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString())
  role: string[] = []
  onFilter = false;
  number = '';
  statusFilter = '';
  typeFilter = '';
  spaceManager = '';
  dateFilter = '';
  idStoreHouse = '';
  storeFilter = localStorage.getItem('store')
  idmanager = aesUtil.decrypt(key, localStorage.getItem('uid').toString())
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  private mySubscription3: Subscription;
  private mySubscription4: Subscription;
  private mySubscription5: Subscription;
  private mySubscription6: Subscription;
  private mySubscription7: Subscription;
  private mySubscription8: Subscription;
  loadStoreHouse: boolean;
  loadStore: boolean;
  loadVoucher: boolean;
  loadUser: boolean;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private storeHouseService: StoreHouseService,
              private storeService: StoreService, private notifService: NotifsService, private cartonService: CartonService,
              private carnetService: CarnetService, private voucherService: VoucherService, private couponService: CouponService,
              private mvtStockService: MvtStockService, private statusService: StatusService, private userService: UsersService) {
    this.formCarton();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getTypeVoucher();
    this.getUsers();
    this.getStores();
    this.getStoreHouses();
    this.getStoreHousesAdmin();
    this.getCartons();
    // console.log(localStorage.getItem('uid').toString())
    // console.log(aesUtil.decrypt(key, localStorage.getItem('uid').toString()))
  }

  //formulaire de création
  formCarton() {
    this.cartonForm = this.fb.group({
      idStoreHouse: ['', [Validators.required]],
      typeVoucher: ['', [Validators.required]],
      serialFrom: ['', [Validators.required, Validators.pattern('^[0-9 ]*$'), Validators.min(1)]],
      serialTo: ['', [Validators.required, Validators.pattern('^[0-9 ]*$'), Validators.min(1)]],
      number: ['', [Validators.required, Validators.pattern('^[0-9 ]*$'), Validators.min(1)]],
      from: ['', [Validators.required, Validators.pattern('^[0-9 ]*$'), Validators.min(1)]],
      to: ['', [Validators.required, Validators.pattern('^[0-9 ]*$'), Validators.min(1)]],
    });
  }

  //récupération de la liste des magasins
  getStores(){
    this.loadStore = true
    this.mySubscription = this.storeService.getStore().subscribe(
      resp => {
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.loadStore = false
      },
      error => {
        // this.notifsService.onError(error.error.message, 'échec chargement magasins')
      }
    )
  }

  //récupération de la liste des entrepots
  getCartons() {
    this.filterCartons()
    this.notifService.onSuccess('chargement des cartons')
  }

  //récupération de la liste des entrepots
  getStoreHousesAdmin() {
    this.idStoreHouse = ''
    this.mySubscription2 = this.storeHouseService.getStoreHouses().subscribe(
      resp => {
        this.isLoading.next(false);
        this.storeHousesAdmin = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(sth => sth.type == 'stockage')
      },
    )
  }

  //récupération de la liste des entrepots
  getStoreHouses() {
    this.idStoreHouse = ''
    this.mySubscription3 = this.storeHouseService.getStoreHousesByStore(this.storeFilter).subscribe(
      resp => {
        this.isLoading.next(false);
        this.storeHouses = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(sth => sth.type == 'stockage')
      },
    )
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  //save carton
  saveCarton() {
    this.isLoading.next(true);
    let typ = this.vouchers.find(tv => tv.amount == parseInt(this.cartonForm.controls['typeVoucher'].value))
    this.carton.idSpaceManager1 = aesUtil.encrypt(key, this.idmanager.toString()) as number
    this.carton.idStoreHouseStockage = aesUtil.encrypt(key, this.cartonForm.controls['idStoreHouse'].value.toString()) as number
    this.carton.number = aesUtil.encrypt(key, this.cartonForm.controls['number'].value.toString()) as number
    this.carton.from = aesUtil.encrypt(key, this.cartonForm.controls['from'].value.toString()) as number
    this.carton.to = aesUtil.encrypt(key, this.cartonForm.controls['to'].value.toString()) as number
    this.carton.serialFrom = aesUtil.encrypt(key, this.cartonForm.controls['serialFrom'].value.toString()) as number
    this.carton.serialTo = aesUtil.encrypt(key, this.cartonForm.controls['serialTo'].value.toString()) as number
    this.carton.typeVoucher = aesUtil.encrypt(key, typ.amount.toString()) as number
    // console.log(this.carton)
    this.cartonService.createCarton(this.carton).subscribe(
      resp => {
        this.isLoading.next(false);
        this.notifService.onSuccess('Carton crée avec succès!')
        this.getCartons();
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  //on récupère la liste des types de coupon
  getTypeVoucher(): void {
    this.loadVoucher = true
    this.mySubscription4 = this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.loadVoucher = false
      }
    )
  }

  getUsers(): void {
    const type = 'MANAGER_SPACES_1'
    this.loadUser = true
    this.mySubscription5 = this.userService.getUsersByTypeAccount(type.toString()).subscribe(
      resp => {
        // console.log(resp)
        this.users = JSON.parse((aesUtil.decrypt(key, resp.key.toString())))
        this.loadUser = false
      }
    )
  }

  annuler() {
    this.formCarton();
    this.cartonForm.reset()
    this.nc = null
    this.sctf = null
    this.sctd = null
    this.scpf = null
    this.scpd = null
    this.storeHouse = new StoreHouse()
    this.modalService.dismissAll()
    this.magasin = ''
  }

  //open modal
  open(content: any) {
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number) {
    this.page = event
    this.filterCartons()
  }

  removeZeros(coupon: string): string {
    return coupon.replace(/[0]/g, '')
  }

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter){
      this.number = '';
      this.statusFilter = '';
      this.typeFilter = '';
      this.spaceManager = '';
      this.dateFilter = '';
      this.idStoreHouse = '';
      this.filterCartons()
    }
  }

  filterCartons() {
    this.page=1
    this.appState$ = this.cartonService.filterCarton$(this.number, this.statusFilter, this.typeFilter, this.idStoreHouse, this.spaceManager, this.dateFilter, this.page - 1, this.size)
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
