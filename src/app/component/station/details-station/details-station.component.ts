import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "../../../_model/store";
import {Order} from "../../../_model/order";
import {StoreHouse} from "../../../_model/storehouse";
import {Unite} from "../../../_model/unite";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {ClientService} from "../../../_services/clients/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../_services/order/order.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreService} from "../../../_services/store/store.service";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {UnitsService} from "../../../_services/units/units.service";
import {Location} from "@angular/common";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {StatusService} from "../../../_services/status/status.service";
import {Un} from "../../magasin/details-magasin/details-magasin.component";
import {Station} from "../../../_model/station";
import {StationService} from "../../../_services/stations/station.service";
import {CreditNote} from "../../../_model/creditNote";
import {CreditNoteService} from "../../../_services/creditNote/credit-note.service";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {Coupon} from "../../../_model/coupon";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {Client} from "../../../_model/client";

@Component({
  selector: 'app-details-station',
  templateUrl: './details-station.component.html',
  styleUrls: ['./details-station.component.css']
})
export class DetailsStationComponent implements OnInit, OnDestroy {

  station: Station = new Station();
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  creditNotes: CreditNote[] = [];
  coupons: Coupon[] = [];
  user = parseInt(aesUtil.decrypt(key, localStorage.getItem('uid').toString()))
  pageCoupon: number = 1;
  pageCreditNote: number = 1;
  totalPagesCoupon: number;
  totalElementsCoupon: number;
  size: number = 10;
  vouchers: TypeVoucher[] = [];
  stations: Station[] = []
  couponForm: FormGroup;
  coupon: Coupon = new Coupon();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  appState$: Observable<AppState<CustomResponse<Station>>>;
  appStateCreditNote$: Observable<AppState<CustomResponse<CreditNote>>>;
  appStateCoupon$: Observable<AppState<CustomResponse<Coupon>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Station>>(null);
  idParam: number;
  onFilterCN: boolean = false;
  onFilterCP: boolean = false;
  dateCNFilter? = ''
  statutCNFilter? = ''
  internalRefCNFilter? = ''
  serialNumber? = ''
  statusFilter? = ''
  typeFilter? = ''
  clientName? = ''
  clients: Client[] = [];
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  private mySubscription3: Subscription;
  load: boolean
  load2: boolean
  constructor(private stationService: StationService, private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal,
              private _location: Location, private voucherService: VoucherService, private statusService: StatusService, private fb: FormBuilder,
              private creditNoteService: CreditNoteService, private couponService: CouponService, private notifService: NotifsService, private clientService: ClientService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key, authority));
    });
    this.formCoupon()
    this.activatedRoute.params.subscribe(params => {
      this.idParam = params['id']
    })
  }

  formCoupon() {
    this.couponForm = this.fb.group({
      coupon: ['', [Validators.required]],
      // idStation: ['', [Validators.required]],
      verif: ['', [Validators.requiredTrue]]
    });
  }


  ngOnInit(): void {
    this.getCreditNoteByStation()
    this.getCouponByStation()
    this.getStationInfos()
    this.getVouchers()
    // this.getStations()
  }
  getVouchers(){
    this.load2 = true
    this.mySubscription = this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.load2 = false
      },
    )
  }
  getStationInfos() {
    this.load = true
    // this.appState$ = this.stationService.getStationByInternalref$(this.idParam)
    //   .pipe(
    //     map(response => {
    //       this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
    //       return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as Station}
    //     }),
    //     startWith({dataState: DataState.LOADING_STATE, appData: null}),
    //     catchError((error: string) => {
    //       return of({dataState: DataState.ERROR_STATE, error: error})
    //     })
    //   )
    this.mySubscription2 = this.stationService.getStationByInternalref(this.idParam as number).subscribe(
      res => {
        this.station = JSON.parse(aesUtil.decrypt(key, res.key.toString()));
        this.load = false
      }, error => {
        this.load = false
      }
    )
  }

  //on récupère la liste des types de coupon
  // getTypeVoucher(): void {
  //   this.voucherService.getTypevoucher().subscribe(
  //     resp => {
  //       this.vouchers = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).content
  //     }
  //   )
  // }

  back() {
    this._location.back()
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  getStatutsCoupon(status: string): string {
    return this.statusService.allStatus(status)
  }

  getCreditNoteByStation() {

    this.appStateCreditNote$ = this.creditNoteService.getCreditNoteByStation$(this.idParam as number, this.internalRefCNFilter, this.statutCNFilter, this.dateCNFilter, this.pageCreditNote - 1, this.size)
      .pipe(
        map(response => {
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as Station}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
    // this.creditNoteService.getCreditNoteByStation(this.idParam).subscribe(
    //   resp => {
    //     this.creditNotes = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).content
    //   },
    // )
  }

  pageChangeCN(event: number) {
    this.pageCreditNote = event
    this.getCreditNoteByStation()
  }

  getCouponByStation() {
    this.appStateCoupon$ = this.couponService.couponByStation$(this.idParam as number, this.serialNumber, this.statusFilter, this.typeFilter, this.clientName, this.pageCoupon - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          // this.notifService.onSuccess('Chargement des coupons')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
    // this.couponService.getCouponsByStation(this.idParam.toString(), ).subscribe(
    //   resp => {
    //     this.coupons = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).content
    //     this.totalElementsCoupon = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).totalElements
    //     this.totalPagesCoupon = JSON.parse(aesUtil.decrypt(key, resp.key.toString())).totalPages
    //   },
    // )
  }

  findClients(event: string): Client[]{
    if (event != '' && event.length >= 3){
      this.mySubscription3 = this.clientService.searchClient(event) .subscribe(
        resp => {
          this.clients = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
          if (this.clients.length <= 1){
            this.getCouponByStation()
          }

          if (!JSON.parse(aesUtil.decrypt(key,resp.key.toString())).length){
            this.notifService.onError('Ce client n\'existe pas', '')
          }
        }
      )
    }else {
      if (this.clientName == ''){
        this.getCouponByStation()
      }
      this.clients = []
    }
    return this.clients
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  pageChangeCP(event: number) {
    this.pageCoupon = event
    this.getCouponByStation()
  }
  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  creditNoteDetails(note: CreditNote) {
    let rout = aesUtil.encrypt(key, note.internalReference.toString())
    while (rout.includes('/')) {
      rout = aesUtil.encrypt(key, note.internalReference.toString())
    }
    this.router.navigate(['/credit-note/details', rout])
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  accepterCoupon() {
    let str = parseInt(this.couponForm.controls['coupon'].value).toString();
    let rout = aesUtil.encrypt(key, str.toString())
    while (rout.includes('/')) {
      rout = aesUtil.encrypt(key, str.toString())
    }
    this.coupon.serialNumber = rout
    const body = {
      "idStation": 0,
      "modulo": 0,
      "idPompist": "",
      "productionDate": "2022-12-16"
    }
    const modulo = 0
    body.idStation = this.idParam as number
    body.idPompist = localStorage.getItem("uid")
    body.modulo = aesUtil.encrypt(key, modulo.toString()) as number
    // body.idStation = this.couponForm.controls['idStation'].value
    // body.productionDate = new Date().toLocaleString().toString()
    // console.log(body)
    this.isLoading.next(true);
    this.couponService.acceptCoupon(this.coupon.serialNumber, body).subscribe(
      resp => {
        this.getCouponByStation()
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('coupon accepté')
      },
      error => {
        this.isLoading.next(false)
      }
    )
  }

  annuler() {
    this.formCoupon();
    this.modalService.dismissAll()
  }

  showFilterCN() {
    this.onFilterCN = !this.onFilterCN

    if (!this.onFilterCN) {
      this.dateCNFilter = '';
      this.statutCNFilter = '';
      this.internalRefCNFilter = '';
      this.getCreditNoteByStation()
    }
  }
  showFilterCP() {
    this.onFilterCP = !this.onFilterCP

    if (!this.onFilterCP) {
      // this.dateFilter = '';
      // this.statutFilter = '';
      // this.stationName = '';
      // this.internalRef = '';
      // this.getCreditNote()
    }
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
    this.mySubscription3 ? this.mySubscription3.unsubscribe() : null;
  }

}
