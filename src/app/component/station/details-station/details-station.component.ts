import {AfterContentInit, Component, OnInit} from '@angular/core';
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
import {BehaviorSubject} from "rxjs";
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-details-station',
  templateUrl: './details-station.component.html',
  styleUrls: ['./details-station.component.css']
})
export class DetailsStationComponent implements OnInit {

  station: Station = new Station();
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  creditNotes: CreditNote[] = [];
  coupons: Coupon[] = [];
  user = parseInt(aesUtil.decrypt(key, localStorage.getItem('uid').toString()))
  pageCoupon: number = 1;
  totalPagesCoupon: number;
  totalElementsCoupon: number;
  size: number = 10;
  vouchers: TypeVoucher[] = [];
  stations: Station[] = []
  couponForm: FormGroup ;
  coupon: Coupon = new Coupon();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  idParam: number;
  constructor(private stationService: StationService, private activatedRoute: ActivatedRoute, private router: Router,private modalService: NgbModal,
              private _location: Location, private voucherService: VoucherService, private statusService: StatusService,private fb: FormBuilder,
              private creditNoteService: CreditNoteService, private couponService: CouponService, private notifService: NotifsService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
    this.formCoupon()
    this.activatedRoute.params.subscribe(params => {
      this.idParam = params['id']
    })
  }

  formCoupon(){
    this.couponForm = this.fb.group({
      coupon: ['', [Validators.required]],
      // idStation: ['', [Validators.required]],
      verif: ['', [Validators.requiredTrue]]
    });
  }


  ngOnInit(): void {
    this.getStationInfos()
    this.getCreditNoteByStation()
    this.getCouponByStation()
    this.getTypeVoucher()
    // this.getStations()
  }

  getStationInfos(){
    // this.activatedRoute.params.subscribe(params => {
      this.stationService.getStationByInternalref(this.idParam as number).subscribe(
        res => {
          this.station = JSON.parse(aesUtil.decrypt(key,res.key.toString()));
        }
      )
    // })
  }

  // getStations(){
  //   this.stationService.getStations().subscribe(
  //     resp => {
  //       this.stations = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
  //     },
  //   )
  // }

  //on récupère la liste des types de coupon
  getTypeVoucher(): void{
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
      }
    )
  }

  back() {
    this._location.back()
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  getStatutsCoupon(status: string): string {
    return this.statusService.allStatus(status)
  }

  getCreditNoteByStation(){
    // this.activatedRoute.params.subscribe(params => {
      this.creditNoteService.getCreditNoteByStation(this.idParam).subscribe(
        resp => {
          this.creditNotes = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
          // console.log(resp)
        },
      )
    // })
  }

  getCouponByStation(){
    // this.activatedRoute.params.subscribe(params => {
      this.couponService.getCouponsByStation(this.idParam as number, this.pageCoupon -1, this.size).subscribe(
        resp => {
          this.coupons = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
          this.totalElementsCoupon = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).totalElements
          this.totalPagesCoupon = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).totalPages
        },
      )
    // })
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  creditNoteDetails(note: CreditNote) {
    this.router.navigate(['/credit-note/details', aesUtil.encrypt(key,note.internalReference.toString())])
  }

  open(content: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  accepterCoupon() {
    let str= parseInt(this.couponForm.controls['coupon'].value).toString();
    this.coupon.serialNumber = aesUtil.encrypt(key, str.toString())
    const body = {
      "idStation": 0,
      "modulo": 0,
      "productionDate": "2022-12-16"
    }
    const modulo = 0
    body.idStation = this.idParam as number
    body.modulo = aesUtil.encrypt(key, modulo.toString()) as number
    // body.idStation = this.couponForm.controls['idStation'].value
    // body.productionDate = new Date().toLocaleString().toString()
    console.log(body)
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

}
