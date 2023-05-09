import { Component, OnInit } from '@angular/core';
import {StoreHouse} from "../../../_model/storehouse";
import {Carton} from "../../../_model/carton";
import {Carnet} from "../../../_model/carnet";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {BehaviorSubject, Observable, of} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {StoreService} from "../../../_services/store/store.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {CartonService} from "../../../_services/cartons/carton.service";
import {CarnetService} from "../../../_services/carnets/carnet.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import Swal from "sweetalert2";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {Coupon} from "../../../_model/coupon";
import {StationService} from "../../../_services/stations/station.service";
import {Station} from "../../../_model/station";
import {StatusService} from "../../../_services/status/status.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Client} from "../../../_model/client";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {ClientService} from "../../../_services/clients/client.service";
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-index-coupon',
  templateUrl: './index-coupon.component.html',
  styleUrls: ['./index-coupon.component.scss']
})
export class IndexCouponComponent implements OnInit {

  storeHouses: StoreHouse[] = [];
  storeHouse: StoreHouse = new StoreHouse();
  cartons: Carton[] = [];
  carton: Carton = new Carton();
  carnet: Carnet = new Carnet();
  carnets: Carnet[];
  coupons: Coupon[];
  coupon: Coupon = new Coupon();
  vouchers: TypeVoucher[] = [];
  onFilter: boolean = false
  stores: Store[] = [];
  store: Store = new Store();
  appState$: Observable<AppState<CustomResponse<Coupon>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Coupon>>(null);
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString())
  role: string[] = []
  magasin: string
  entrepot: string;
  typcoupon: any;
  sn: any;
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  serialNumber? = ''
  statusFilter? = ''
  typeFilter? = ''
  clientName? = ''
  stationName? = ''
  clients: Client[] = [];
  stations: Station[] = [];

  constructor(private fb: FormBuilder, private modalService: NgbModal, private storeHouseService: StoreHouseService,
              private storeService: StoreService, private notifService: NotifsService, private cartonService: CartonService,
              private carnetService: CarnetService, private voucherService: VoucherService, private couponService: CouponService,
              private stationService: StationService, private statusService: StatusService, private clientService: ClientService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getCoupons();
    this.getVouchers();
  }

  //récupération de la liste des magasins
  getStores(){
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
    )
  }

  getVouchers(){
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = resp.content
      },
    )
  }

  //récupération de la liste des entrepots
  getCoupons(){
    this.appState$ = this.couponService.coupons$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.notifService.onSuccess('chargement des coupons')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number){
    this.page = event
    // this.appState$ = this.couponService.filterCoupon$(this.serialNumber, this.statusFilter,this.page - 1, this.size)
    //   .pipe(
    //     map(response => {
    //       this.dataSubjects.next(response)
    //       // this.notifsService.onSuccess('Chargement des commandes')
    //       return {dataState: DataState.LOADED_STATE, appData: response}
    //     }),
    //     startWith({dataState: DataState.LOADING_STATE, appData: null}),
    //     catchError((error: string) => {
    //       return of({dataState: DataState.ERROR_STATE, error: error})
    //     })
    //   )
    this.appState$ = this.couponService.filterCoupon$(this.serialNumber, this.statusFilter, this.typeFilter, this.clientName, this.stationName, this.page - 1, this.size)
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

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  filterCoupons() {
    this.page=1
    this.appState$ = this.couponService.filterCoupon$(this.serialNumber, this.statusFilter, this.typeFilter, this.clientName, this.stationName, this.page - 1, this.size)
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

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter){
      this.serialNumber = '';
      this.statusFilter = '';
      this.typeFilter = '';
      this.clientName = '';
      this.stationName = '';
      this.filterCoupons()
    }
  }

  findClients(event: string): Client[]{
    if (event != '' && event.length >= 3){
      this.clientService.searchClient(event) .subscribe(
        resp => {
          this.clients = resp;
          if (this.clients.length <= 1){
            this.filterCoupons()
          }

          if (!resp.length){
            this.notifService.onError('Ce client n\'existe pas', '')
          }
        }
      )
    }else {
      if (this.clientName == ''){
        this.filterCoupons()
      }
      this.clients = []
    }
    return this.clients
  }

  findStation(event: string): Station[]{
    if (event != '' && event.length >= 3){
      this.stationService.searchStation(event).subscribe(
        resp => {
          this.stations = resp;
          if (this.stations.length <= 1){
            this.filterCoupons()
          }

          if (!resp.length){
            this.notifService.onError('Cette station n\'existe pas', '')
          }
        }
      )
    }else {
      if (this.stationName == ''){
        this.filterCoupons()
      }
      this.stations = []
    }
    return this.stations
  }
}
