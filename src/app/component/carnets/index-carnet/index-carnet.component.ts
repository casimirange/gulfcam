import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {StatusService} from "../../../_services/status/status.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Coupon} from "../../../_model/coupon";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-index-carnet',
  templateUrl: './index-carnet.component.html',
  styleUrls: ['./index-carnet.component.css']
})
export class IndexCarnetComponent implements OnInit {

  storeHouses: StoreHouse[] = [];
  storeHouse: StoreHouse = new StoreHouse();
  cartons: Carton[] = [];
  carton: Carton = new Carton();
  carnet: Carnet = new Carnet();
  carnets: Carnet[];
  vouchers: TypeVoucher[] = [];
  cartonForm: FormGroup ;
  stores: Store[] = [];
  store: Store = new Store();
  appState$: Observable<AppState<CustomResponse<Carnet>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Carnet>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  magasin: string
  entrepot: string;
  typcoupon: any;
  sn: any;
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString())
  role: string[] = []
  constructor(private fb: FormBuilder, private modalService: NgbModal, private storeHouseService: StoreHouseService,
              private storeService: StoreService, private notifService: NotifsService, private cartonService: CartonService,
              private carnetService: CarnetService, private voucherService: VoucherService, private statusService: StatusService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getCarnets();
  }
  //récupération de la liste des entrepots
  getCarnets(){
    this.appState$ = this.carnetService.carnets$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.notifService.onSuccess('chargement des carnets')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number){
    this.page = event
    this.getCarnets()
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }
}
