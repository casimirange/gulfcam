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

@Component({
  selector: 'app-details-station',
  templateUrl: './details-station.component.html',
  styleUrls: ['./details-station.component.css']
})
export class DetailsStationComponent implements OnInit, AfterContentInit {

  station: Station = new Station();
  roleUser = localStorage.getItem('userAccount').toString()
  role: string[] = []
  creditNotes: CreditNote[] = [];
  coupons: Coupon[] = [];
  user = parseInt(localStorage.getItem('uid').toString())
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
  constructor(private stationService: StationService, private activatedRoute: ActivatedRoute, private router: Router,private modalService: NgbModal,
              private _location: Location, private voucherService: VoucherService, private statusService: StatusService,private fb: FormBuilder,
              private creditNoteService: CreditNoteService, private couponService: CouponService, private notifService: NotifsService) {
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
    this.formCoupon()
  }

  formCoupon(){
    this.couponForm = this.fb.group({
      coupon: ['', [Validators.required]],
      idStation: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.getStationInfos()
    this.getCreditNoteByStation()
    this.getCouponByStation()
    this.getTypeVoucher()
    this.getStations()
  }

  getStationInfos(){
    this.activatedRoute.params.subscribe(params => {
      this.stationService.getStationByInternalref(params['id']).subscribe(
        res => {
          this.station = res;
          console.log(res)
        }
      )
    })
  }

  getStations(){
    this.stationService.getStations().subscribe(
      resp => {
        this.stations = resp.content
      },
    )
  }

  //on récupère la liste des types de coupon
  getTypeVoucher(): void{
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.vouchers = resp.content
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
    this.activatedRoute.params.subscribe(params => {
      this.creditNoteService.getCreditNoteByStation(parseInt(params['id'])).subscribe(
        resp => {
          this.creditNotes = resp.content
        },
      )
    })
  }

  getCouponByStation(){
    this.activatedRoute.params.subscribe(params => {
      this.couponService.getCouponsByStation(parseInt(params['id']), this.pageCoupon -1, this.size).subscribe(
        resp => {
          this.coupons = resp.content
          this.totalElementsCoupon = resp.totalElements
          this.totalPagesCoupon = resp.totalPages
        },
      )
    })
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  creditNoteDetails(note: CreditNote) {
    this.router.navigate(['/credit-note/details', note.internalReference])
  }

  open(content: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  accepterCoupon() {
    let str= parseInt(this.couponForm.controls['coupon'].value).toString();
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

  ngAfterContentInit(): void {
    this.getStatutsCoupon()
  }
}
