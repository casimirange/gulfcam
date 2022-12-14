import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../_services/users/users.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {Store} from "../../../_model/store";
import {BehaviorSubject} from "rxjs";
import {Supply} from "../../../_model/supply";
import {StoreHouse} from "../../../_model/storehouse";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {CartonService} from "../../../_services/cartons/carton.service";
import {Carton} from "../../../_model/carton";
import Swal from "sweetalert2";

@Component({
  selector: 'app-approvisionner-carnet',
  templateUrl: './approvisionner-carnet.component.html',
  styleUrls: ['./approvisionner-carnet.component.css']
})
export class ApprovisionnerCarnetComponent implements OnInit {

  store: Store = new Store();
  supply: Supply = new Supply();
  supplyForm: FormGroup ;
  cartons: Carton[] = [];
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  sn: any;
  storeHouse1: StoreHouse = new StoreHouse();
  storeHouse2: StoreHouse = new StoreHouse();
  storeHouses1: StoreHouse[] = [];
  storeHouses2: StoreHouse[] = [];
  roleUser = localStorage.getItem('userAccount').toString()
  constructor(private userService: UsersService,  private notifsService: NotifsService, private route: ActivatedRoute,
              private storeService: StoreService, private storeHouseService: StoreHouseService, private fb: FormBuilder,
              private voucherService: VoucherService, private cartonService: CartonService) {
    this.formSupply()
    this.form = this.supplyForm.controls;
  }

  formSupply(){
    this.supplyForm = this.fb.group({
      idCarton: ['', [Validators.required]],
      idStoreHouseSell: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getStoreHouses()
    this.getCartons()
  }


  //on r??cup??re la liste des types de coupon
  getCartons(): void{
    this.cartonService.getAllCartonWithPagination(0, 500).subscribe(
      resp => {
        this.cartons = resp.content.filter((carton: Carton) => carton.status.name === 'AVAILABLE')
      }
    )
  }

  getStoreHouses(){
    this.storeHouseService.getAllStoreHousesWithPagination(0, 500).subscribe(
      resp => {
        this.storeHouses2 = resp.content.filter(st => st.type == 'vente')
      },
    )
  }
  //save carton
  supplyCarton(){
    this.isLoading.next(true);
    this.supply.idCarton = this.supplyForm.controls['idCarton'].value
    this.supply.idStoreHouseSell = this.supplyForm.controls['idStoreHouseSell'].value
    setTimeout(() =>{
      const notif = 'Vous recevrez une notification une fois l\'op??ration termin??e'
      Swal.fire({
        title: 'Op??ration en cours',
        html: 'Le syst??me est entrain de cr??er les carnets et g??n??rer les coupons. '+ notif.toString().bold() ,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        focusConfirm: false,
        timer: 3000,
        backdrop: `rgba(0, 0, 0, 0.4)`
      }).then((result) => {
        if (result.value) {
          this.annuler()
        }
      })
    }  , 1000);

    console.log('supply', this.supply)

    this.cartonService.createCartonSupply(this.supply.idCarton, this.supply.idStoreHouseSell).subscribe(
      resp => {

        this.isLoading.next(false);
        this.notifsService.onSuccess('approvisionnement effectu??')
        // this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  annuler() {
    this.formSupply();
    this.supplyForm.reset()
  }


}
