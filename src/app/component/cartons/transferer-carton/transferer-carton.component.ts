import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {Store} from "../../../_model/store";
import {StoreHouse} from "../../../_model/storehouse";
import {Supply} from "../../../_model/supply";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {BehaviorSubject, Subscription} from "rxjs";
import {UsersService} from "../../../_services/users/users.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {CartonService} from "../../../_services/cartons/carton.service";
import {MvtStockService} from "../../../_services/stock/mvt-stock.service";
import {Stock} from "../../../_model/stock";
import {Carton} from "../../../_model/carton";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-transferer-carton',
  templateUrl: './transferer-carton.component.html',
  styleUrls: ['./transferer-carton.component.css']
})
export class TransfererCartonComponent implements OnInit, OnDestroy {

  stock: Stock = new Stock();
  tranfertForm: FormGroup ;
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private isLoad = new BehaviorSubject<boolean>(false);
  isLoad$ = this.isLoad.asObservable();
  cartons: Carton[];
  storeHouses1: StoreHouse[];
  storeHousesAdmin: StoreHouse[];
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  idmanager = localStorage.getItem('uid')
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  loadCarton: boolean;
  loadStoreHouse: boolean;
  constructor(private notifsService: NotifsService, private storeHouseService: StoreHouseService, private fb: FormBuilder,
              private cartonService: CartonService, private mvtService: MvtStockService) {
    this.formTransfert()
    this.form = this.tranfertForm.controls;
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  formTransfert(){
    this.tranfertForm = this.fb.group({
      idCarton: ['', [Validators.required]],
      idStoreHouseStockage: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getCartons()
    this.getStoreHouses()
  }

  //on récupère la liste des types de coupon
  getCartons(): void{
    this.loadCarton = true
    this.mySubscription = this.cartonService.getAllCartonWithPagination(0, 500).subscribe(
      resp => {
        this.cartons = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter((carton: Carton) => carton.status.name === 'AVAILABLE' && carton.storeHouse.idStore == (aesUtil.decrypt(key, localStorage.getItem('store').toString()) as number))
        this.loadCarton = false
      }
    )
  }

  getStoreHouses(){
    // this.storeHouseService.getAllStoreHousesWithPagination(0, 500, localStorage.getItem('store').toString(), 'vente').subscribe(
    //   resp => {
    //     // this.storeHouses2 = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(st => st.type == 'vente' && st.store.internalReference == (aesUtil.decrypt(key, localStorage.getItem('store').toString()) as number))
    //     this.storeHouses1 = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
    //   },
    // )
    this.loadStoreHouse = true
    this.mySubscription2 = this.storeHouseService.getAllStoreHousesWithPagination(0, 500, '', 'stockage').subscribe(
      resp => {
        this.storeHouses1 = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(st => st.store.internalReference != (aesUtil.decrypt(key, localStorage.getItem('store').toString()) as number))
        this.loadStoreHouse = false
      },
    )
  }

  //save carton
  transfertCarton(){
    this.isLoading.next(true);
    this.stock.idSpaceManager1 = this.idmanager
    let rout = aesUtil.encrypt(key, this.tranfertForm.controls['idStoreHouseStockage'].value.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, this.tranfertForm.controls['idStoreHouseStockage'].value.toString())
    }
    this.stock.idStoreHouseStockage = rout
    let cartons =[]
    let ct = aesUtil.encrypt(key, this.tranfertForm.controls['idCarton'].value.toString())
    while (ct.includes('/')){
      ct = aesUtil.encrypt(key, this.tranfertForm.controls['idCarton'].value.toString())
    }
    cartons.push(ct)
    this.stock.listCartons = ct

    this.mvtService.createStockMovement(this.stock).subscribe(
      resp => {
        this.isLoading.next(false);
        this.getCartons()
        this.notifsService.onSuccess('Transfert effectué')
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  annuler() {
    this.tranfertForm.reset()
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
  }

}
