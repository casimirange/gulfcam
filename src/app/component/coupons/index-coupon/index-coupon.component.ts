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
  couponForm: FormGroup ;
  stores: Store[] = [];
  store: Store = new Store();
  appState$: Observable<AppState<CustomResponse<Coupon>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Coupon>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  roleUser = localStorage.getItem('userAccount').toString()
  magasin: string
  entrepot: string;
  typcoupon: any;
  sn: any;
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;

  stations: Station[] = []
  constructor(private fb: FormBuilder, private modalService: NgbModal, private storeHouseService: StoreHouseService,
              private storeService: StoreService, private notifService: NotifsService, private cartonService: CartonService,
              private carnetService: CarnetService, private voucherService: VoucherService, private couponService: CouponService,
              private stationService: StationService, private statusService: StatusService) {
    this.formCoupon();
  }

  ngOnInit(): void {
    this.getCoupons();
    this.getStations();
  }

  //formulaire de création
  formCoupon(){
    this.couponForm = this.fb.group({
      coupon: ['', [Validators.required]],
      idStation: ['', [Validators.required]],
    });
  }

  //récupération de la liste des magasins
  getStores(){
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
    )
  }

  //récupération de la liste des magasins
  getStations(){
    this.stationService.getStations().subscribe(
      resp => {
        this.stations = resp.content
      },
    )
  }


  //récupération de la liste des entrepots
  getCoupons(){
    this.appState$ = this.couponService.coupons$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          console.log('coupons', response)
          this.notifService.onSuccess('chargement des coupons')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  annuler() {
    this.formCoupon();
    this.modalService.dismissAll()
  }

  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  pageChange(event: number){
    this.page = event
    this.appState$ = this.couponService.coupons$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          console.log(response)
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

  accepterCoupon() {
    let str= parseInt(this.couponForm.controls['coupon'].value).toString();
    this.store.localization = this.couponForm.value
    this.coupon.serialNumber = str
    const body = {
      "idStation": 0,
      "modulo": 0,
      "productionDate": "2022-12-16"
    }
    body.idStation = this.couponForm.controls['idStation'].value
    // body.productionDate = new Date().toLocaleString().toString()
    // console.log(body.productionDate)
    this.isLoading.next(true);
    this.couponService.acceptCoupon(this.coupon.serialNumber, body).subscribe(
      resp => {
        console.log(resp)
        this.getCoupons()
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('coupon accepté')
      },
      error => {
        this.isLoading.next(false)
      }
    )
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }
}
