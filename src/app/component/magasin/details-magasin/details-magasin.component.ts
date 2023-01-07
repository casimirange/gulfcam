import { Component, OnInit } from '@angular/core';
import {Order} from "../../../_model/order";
import {Store} from "../../../_model/store";
import {ClientService} from "../../../_services/clients/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../_services/order/order.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreService} from "../../../_services/store/store.service";
import {StoreHouse} from "../../../_model/storehouse";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {UnitsService} from "../../../_services/units/units.service";
import {Unite} from "../../../_model/unite";
import {Location} from "@angular/common";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import Swal from "sweetalert2";
import {StatusService} from "../../../_services/status/status.service";
export class Un{
  cp: number
  qtc: number
  qtn: number
}
@Component({
  selector: 'app-details-magasin',
  templateUrl: './details-magasin.component.html',
  styleUrls: ['./details-magasin.component.css']
})
export class DetailsMagasinComponent implements OnInit {

  store: Store;
  storeHouses: StoreHouse[] = [];
  roleUser = localStorage.getItem('userAccount').toString()
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private notifService: NotifsService, private storeService: StoreService,
              private storeHouseService: StoreHouseService, private _location: Location, private statusService: StatusService, ) {
    this.store = new Store()
  }

  ngOnInit(): void {
    this.getStoreInfos()
    this.getStoreHousesByStore()
  }


  getStoreInfos(){
    console.log(this.router.url)
    this.activatedRoute.params.subscribe(params => {
      this.storeService.getStoreByInternalref(params['id']).subscribe(
        res => {
          this.store = res;
        }
      )
    })
  }

  getStoreHousesByStore(){
    console.log(this.router.url)
    this.activatedRoute.params.subscribe(params => {
      this.storeHouseService.getStoreHousesByStore(parseInt(params['id'].toString())).subscribe(
        res => {
          this.storeHouses = res.content;
          this.notifService.onSuccess('chargement des espaces de stockage du magasin')
        }
      )
    })
  }

  back() {
    this._location.back()
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }
}
