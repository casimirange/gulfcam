import { Component, OnInit } from '@angular/core';
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {Store} from "../../../_model/store";
import {StoreHouse} from "../../../_model/storehouse";
import {Supply} from "../../../_model/supply";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {BehaviorSubject} from "rxjs";
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
export class TransfererCartonComponent implements OnInit {

  stock: Stock = new Stock();
  tranfertForm: FormGroup ;
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  cartons: Carton[] = [];
  storeHouses1: StoreHouse[] = [];
  storeHousesAdmin: StoreHouse[] = [];
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  idmanager = aesUtil.decrypt(key, localStorage.getItem('uid').toString())
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
    this.getStoreHousesAdmin()
  }

  //on récupère la liste des types de coupon
  getCartons(): void{
    this.cartonService.getAllCartonWithPagination(0, 500).subscribe(
      resp => {
        this.cartons = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter((carton: Carton) => carton.status.name === 'AVAILABLE' && carton.storeHouse.idStore == (aesUtil.decrypt(key, localStorage.getItem('store').toString()) as number))
      }
    )
  }

  //récupération de la liste des entrepots
  getStoreHousesAdmin() {
    this.storeHouseService.getStoreHouses().subscribe(
      resp => {
        this.isLoading.next(false);
        this.storeHousesAdmin = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(sth => sth.type == 'stockage')
      },
    )
  }

  getStoreHouses(){
    this.storeHouseService.getAllStoreHousesWithPagination(0, 500).subscribe(
      resp => {
        this.storeHouses1 = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(st => st.type == 'stockage' && st.store.internalReference != (aesUtil.decrypt(key, localStorage.getItem('store').toString()) as number))
      },
    )
  }

  //save carton
  transfertCarton(){
    this.isLoading.next(true);
    this.stock.idSpaceManager1 = aesUtil.encrypt(key, this.idmanager.toString()) as number
    this.stock.idStoreHouseStockage = aesUtil.encrypt(key, this.tranfertForm.controls['idStoreHouseStockage'].value.toString()) as number
    let cartons =[]
    cartons.push(aesUtil.encrypt(key, this.tranfertForm.controls['idCarton'].value.toString()) as number)
    this.stock.listCartons = cartons

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

}
