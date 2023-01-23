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
  constructor(private notifsService: NotifsService, private storeHouseService: StoreHouseService, private fb: FormBuilder,
              private cartonService: CartonService, private mvtService: MvtStockService) {
    this.formTransfert()
    this.form = this.tranfertForm.controls;
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
    this.cartonService.getAllCartonWithPagination(0, 500).subscribe(
      resp => {
        this.cartons = resp.content.filter((carton: Carton) => carton.status.name === 'AVAILABLE' && carton.storeHouse.idStore == parseInt(localStorage.getItem('store')))
      }
    )
  }

  getStoreHouses(){
    this.storeHouseService.getAllStoreHousesWithPagination(0, 500).subscribe(
      resp => {
        this.storeHouses1 = resp.content.filter(st => st.type == 'stockage' && st.store.internalReference != parseInt(localStorage.getItem('store')))
      },
    )
  }

  //save carton
  transfertCarton(){
    this.isLoading.next(true);
    this.stock.idStoreKeeper = parseInt(localStorage.getItem('uid').toString())
    this.stock.idStoreHouseStockage = parseInt(this.tranfertForm.controls['idStoreHouseStockage'].value)
    let cartons =[]
    cartons.push(this.tranfertForm.controls['idCarton'].value)
    this.stock.listCartons = cartons

    this.mvtService.createStockMovement(this.stock).subscribe(
      resp => {
        this.isLoading.next(false);
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
