import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "../../../_model/store";
import {Order} from "../../../_model/order";
import {StoreHouse} from "../../../_model/storehouse";
import {Unite} from "../../../_model/unite";
import {ClientService} from "../../../_services/clients/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../_services/order/order.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreService} from "../../../_services/store/store.service";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {UnitsService} from "../../../_services/units/units.service";
import {Location} from "@angular/common";
import {ItemService} from "../../../_services/items/item.service";
import {Piece} from "../../../_model/piece";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {CartonService} from "../../../_services/cartons/carton.service";
import {CarnetService} from "../../../_services/carnets/carnet.service";
import {Carton} from "../../../_model/carton";
import {Carnet} from "../../../_model/carnet";
import {Un} from "../../magasin/details-magasin/details-magasin.component";
import {StatusService} from "../../../_services/status/status.service";
import {catchError, map, startWith} from "rxjs/operators";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-details-entrepot',
  templateUrl: './details-entrepot.component.html',
  styleUrls: ['./details-entrepot.component.css']
})
export class DetailsEntrepotComponent implements OnInit, OnDestroy {

  store: Store;
  storeHouse: StoreHouse = new StoreHouse();
  items: Piece[] = [];
  item: Piece = new Piece();
  storeHouses: StoreHouse[] = [];
  all: Un[] = []
  cartons: Carton[] = [];
  carnets: Carnet[] = [];
  units: Unite[] = [];
  page: number = 1;
  totalPages: number;
  totalElements: number;
  page1: number = 1;
  totalPages1: number;
  totalElements1: number;
  size1: number = 20;
  size: number = 20;
  carnetState$: Observable<AppState<CustomResponse<Carnet>>>;
  cartonState$: Observable<AppState<CustomResponse<Carton>>>;
  readonly DataState = DataState;
  private datacarnetSubjects = new BehaviorSubject<CustomResponse<Carnet>>(null);
  private datacartonSubjects = new BehaviorSubject<CustomResponse<Carton>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private isLoadingCarton = new BehaviorSubject<boolean>(false);
  isLoadingCarton$ = this.isLoadingCarton.asObservable();
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  load: boolean
  constructor(private clientService: ClientService, private activatedRoute: ActivatedRoute, private router: Router,
              private orderService: OrderService, private notifService: NotifsService, private storeService: StoreService,
              private storeHouseService: StoreHouseService, private unitService: UnitsService, private _location: Location,
              private itemService: ItemService, private voucherService: VoucherService, private cartonService: CartonService,
              private carnetService: CarnetService, private statusService: StatusService) {
    this.store = new Store()
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getStoreHouseInfos(),
    // this.getVoucherType()
    this.getCartonsByStoreHouse()
    this.getCarnetsByStoreHouse()
    this.getItemsByStoreHouse()
  }

  getCartonsByStoreHouse(){
    this.activatedRoute.params.subscribe(params => {

      this.cartonState$ = this.cartonService.cartonsByStoreHouse$(params['id'],this.page - 1, this.size)
        .pipe(
          map(response => {
            this.datacartonSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
            return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )

      // this.cartonService.getCartonsByStoreHouse(params['id'], this.page - 1, this.size1).subscribe(
      //   res => {
      //     this.cartons = res.content;
      //     console.log('cartons', this.cartons)
      //     this.size = res.size
      //     this.totalPages = res.totalPages
      //     this.totalElements = res.totalElements
      //   }
      // )
    })
  }

  getCarnetsByStoreHouse(){
    this.activatedRoute.params.subscribe(params => {

      this.carnetState$ = this.carnetService.carnetsByStoreHouse$(params['id'],this.page1 - 1, this.size)
        .pipe(
          map(response => {
            this.datacarnetSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
            return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )
    })
  }

  getStoreHouseInfos(){
    this.load = true
    this.activatedRoute.params.subscribe(params => {
      this.mySubscription = this.storeHouseService.getStoreHouseByInternalRef(params['id']).subscribe(
        res => {
          this.storeHouse = JSON.parse(aesUtil.decrypt(key,res.key.toString()));
          this.load = false
        }
      )
    })
  }

  getItemsByStoreHouse(){
    this.activatedRoute.params.subscribe(params => {
      this.mySubscription2 = this.storeHouseService.getItemByStoreHouse(params['id']).subscribe(
        res => {
          this.items = JSON.parse(aesUtil.decrypt(key,res.key.toString()));
        }
      )
    })
  }

  back() {
    this._location.back()
  }

  pageChangeCarnet(event: number){
    this.page1 = event
    this.getCarnetsByStoreHouse()
  }

  pageChangeCarton(event: number){
    this.page = event
    this.getCartonsByStoreHouse()
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }


  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  removeZeros(coupon: string): string{
    return coupon.replace(/[0]/g,'')
  }

  // findCarton(idCarton: number): number {
  //   let numero: number
  //   this.cartonService.findCarton(idCarton).subscribe(
  //     res => {
  //       console.log('carton',res)
  //       numero = res.number;
  //     }
  //   )
  //   return numero
  // }

  formatNumber(amount: number): string{
    return amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
  }
}
