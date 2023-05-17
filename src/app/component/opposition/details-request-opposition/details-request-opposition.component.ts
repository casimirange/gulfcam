import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {RequestOpposition} from "../../../_model/requestOpposition";
import {OppositionService} from "../../../_services/opposition/opposition.service";
import {Ticket} from "../../../_model/ticket";
import {TicketService} from "../../../_services/ticket/ticket.service";
import {StatusService} from "../../../_services/status/status.service";
import {BehaviorSubject} from "rxjs";
import {Location} from "@angular/common";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {Coupon} from "../../../_model/coupon";
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-details-request-opposition',
  templateUrl: './details-request-opposition.component.html',
  styleUrls: ['./details-request-opposition.component.css']
})
export class DetailsRequestOppositionComponent implements OnInit {

  request: RequestOpposition = new RequestOpposition();
  tickets: Ticket[] = [];
  coupons: Coupon[] = [];
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString());
  role: string[] = [];
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  statut: string;
  idmanager = aesUtil.decrypt(key, localStorage.getItem('uid').toString())

  constructor(private requestService: OppositionService, private activatedRoute: ActivatedRoute, private router: Router,
              private ticketService: TicketService, private notifService: NotifsService, private statusService: StatusService,
              private _location: Location, private couponService: CouponService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getRequestInfos()
    this.getTicketsByRequestOpposition()
  }

  getRequestInfos() {
    this.activatedRoute.params.subscribe(params => {
      this.requestService.getRequestByInternalRef(params['id'] as string).subscribe(
        res => {

          console.log(JSON.parse(aesUtil.decrypt(key,res.key.toString())));
          this.request = JSON.parse(aesUtil.decrypt(key,res.key.toString()));
          this.statut = this.request.status.name
        }
      )
    })
  }

  getTicketsByRequestOpposition() {
    this.tickets = []
    this.activatedRoute.params.subscribe(params => {
      this.ticketService.getTicketByRequestOpposition(params['id'] as number, this.page-1, this.size).subscribe(
        resp => {
          this.tickets = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content;
          this.size = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).size
          this.totalPages = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).totalPages
          this.totalElements = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).totalElements
          // this.getCoupons()
          this.notifService.onSuccess('chargement des tickets')
        }
      )
    })
  }

  getCoupons(){
    this.coupons = []
    for (let ticket of this.tickets){
      this.couponService.getCouponByInternalRel(ticket.idCoupon).subscribe(
        res => {
          console.log('coupon',res)
          this.coupons.push(res)
        }, error => {
          this.notifService.onError("Ce coupon n'existe pas", '')
        }
      )
    }
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  validRequest() {
    this.isLoading.next(true);
    this.activatedRoute.params.subscribe(params => {
      this.requestService.validOppositionRequest(params['id']).subscribe(
        resp => {
          this.isLoading.next(false);
          this.getRequestInfos()
          this.getTicketsByRequestOpposition()
          this.notifService.onSuccess("requête d'opposition validée")
        },
      )
    })
  }

  back() {
    this._location.back()
  }

  pageChange(event: number){
    this.page = event
    this.getTicketsByRequestOpposition()
  }

  formatNumber(amount: string): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }
}
