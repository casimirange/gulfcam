import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StoreHouse} from "../../../_model/storehouse";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {BehaviorSubject, Observable, of} from "rxjs";
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
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-stock-carton',
  templateUrl: './stock-carton.component.html',
  styleUrls: ['./stock-carton.component.scss']
})
export class StockCartonComponent implements OnInit {

  storeHouses: StoreHouse[] = [];
  storeHouse: StoreHouse = new StoreHouse();
  cartons: Carton[] = [];
  carton: Carton = new Carton();
  carnet: Carnet = new Carnet();
  coupon: Coupon = new Coupon();
  mvtStock: Stock = new Stock();
  vouchers: TypeVoucher[] = [];
  users: ISignup[] = [];
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
    this.getStoreHouses();
    this.getCartons();
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
  getStores() {
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
    )
  }

  //récupération de la liste des entrepots
  getCartons() {
    this.appState$ = this.cartonService.filterCarton$(this.number, this.statusFilter, this.typeFilter, this.idStoreHouse, this.spaceManager, this.dateFilter, this.page - 1, this.size)
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

  //récupération de la liste des entrepots
  getStoreHouses() {
    this.storeHouseService.getStoreHousesByStore(parseInt(aesUtil.decrypt(key, localStorage.getItem('store')))).subscribe(
      resp => {
        this.isLoading.next(false);
        this.storeHouses = resp.content.filter(sth => sth.type == 'stockage')
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
    this.carton.idSpaceManager1 = parseInt(aesUtil.decrypt(key, localStorage.getItem('uid').toString()))
    this.carton.idStoreHouseStockage = parseInt(this.cartonForm.controls['idStoreHouse'].value)
    this.carton.number = parseInt(this.cartonForm.controls['number'].value)
    this.carton.from = parseInt(this.cartonForm.controls['from'].value)
    this.carton.to = parseInt(this.cartonForm.controls['to'].value)
    this.carton.serialFrom = parseInt(this.cartonForm.controls['serialFrom'].value)
    this.carton.serialTo = parseInt(this.cartonForm.controls['serialTo'].value)
    this.carton.typeVoucher = typ.amount
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
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = resp.content
      }
    )
  }

  getUsers(): void {
    const type = 'MANAGER_SPACES_1'
    this.userService.getUsersByTypeAccount(type.toString()).subscribe(
      resp => {
        console.log(resp)
        this.users = resp
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
    this.appState$ = this.cartonService.filterCarton$(this.number, this.statusFilter, this.typeFilter, this.idStoreHouse, this.spaceManager, this.dateFilter, this.page - 1, this.size)
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
}
