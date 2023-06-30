import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {aesUtil, key} from "../../../_helpers/aes.js";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Carnet} from "../../../_model/carnet";
import {Carton} from "../../../_model/carton";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
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
export class DetailsMagasinComponent implements OnInit, OnDestroy {

  store: Store;
  storeHouses: StoreHouse[] = [];
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  storeState$: Observable<AppState<Store>>;
  storeHouseState$: Observable<AppState<CustomResponse<StoreHouse>>>;
  readonly DataState = DataState;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  page = 1;
  size = 20;
  load: boolean
  private mySubscription: Subscription;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private notifService: NotifsService, private storeService: StoreService,
              private storeHouseService: StoreHouseService, private _location: Location, private statusService: StatusService, ) {
    this.store = new Store()
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getStoreInfos()
    this.getStoreHousesByStore()
  }


  getStoreInfos(){
    this.load = true
    this.activatedRoute.params.subscribe(params => {
      // this.storeState$ = this.storeHouseService.storeHouseByInternalRef$(params['id'].toString())
      //   .pipe(
      //     map(response => {
      //       this.notifService.onSuccess('chargement des espaces de stockage du magasin')
      //       return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
      //     }),
      //     startWith({dataState: DataState.LOADING_STATE, appData: null}),
      //     catchError((error: string) => {
      //       return of({dataState: DataState.ERROR_STATE, error: error})
      //     })
      //   )
      this.mySubscription = this.storeService.getStoreByInternalref(params['id']).subscribe(
        res => {
          // console.log(JSON.parse(aesUtil.decrypt(key,res.key.toString())))
          this.store = JSON.parse(aesUtil.decrypt(key,res.key.toString()));
          this.load = false
        }, error => {
          this.load = false
        }
      )
    })
  }

  getStoreHousesByStore(){
    this.activatedRoute.params.subscribe(params => {
      this.storeHouseState$ = this.storeHouseService.storeHouseByStore$(params['id'].toString(), this.page -1)
        .pipe(
          map(response => {
            this.notifService.onSuccess('chargement des espaces de stockage du magasin')
            return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )

      // this.storeHouseService.getStoreHousesByStore(params['id']).subscribe(
      //   res => {
      //     this.storeHouses = JSON.parse(aesUtil.decrypt(key,res.key.toString())).content;
      //     this.notifService.onSuccess('chargement des espaces de stockage du magasin')
      //   }
      // )
    })
  }

  back() {
    this._location.back()
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  showDetails(storeHouse: number) {
    let rout = aesUtil.encrypt(key, storeHouse.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, storeHouse.toString())
    }
    this.router.navigate(['/entrepots/details', rout])
  }

  pageChange(event: number){
    this.page = event
    this.getStoreHousesByStore()
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null
  }
}
