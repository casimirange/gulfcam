import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../_services/users/users.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {Store} from "../../../_model/store";
import {BehaviorSubject, Subscription} from "rxjs";
import {Supply} from "../../../_model/supply";
import {StoreHouse} from "../../../_model/storehouse";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {CartonService} from "../../../_services/cartons/carton.service";
import {Carton} from "../../../_model/carton";
import Swal from "sweetalert2";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-approvisionner-carnet',
  templateUrl: './approvisionner-carnet.component.html',
  styleUrls: ['./approvisionner-carnet.component.css']
})
export class ApprovisionnerCarnetComponent implements OnInit, OnDestroy {

  store: Store = new Store();
  supply: Supply = new Supply();
  supplyForm: FormGroup ;
  cartons: Carton[];
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  sn: any;
  storeHouses2: StoreHouse[];
  storeHousesAdmin: StoreHouse[] = [];
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString())
  role: string[] = []
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  loadCarton: boolean;
  loadStoreHouse: boolean;
  constructor(private userService: UsersService,  private notifsService: NotifsService, private route: ActivatedRoute,
              private storeService: StoreService, private storeHouseService: StoreHouseService, private fb: FormBuilder,
              private voucherService: VoucherService, private cartonService: CartonService) {
    this.formSupply()
    this.form = this.supplyForm.controls;
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  formSupply(){
    this.supplyForm = this.fb.group({
      idCarton: ['', [Validators.required]],
      idStoreHouseSell: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getStoreHouses()
    // this.getStoreHousesAdmin()
    this.getCartons()
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

  //récupération de la liste des entrepots
  // getStoreHousesAdmin() {
  //   this.storeHouseService.getStoreHouses().subscribe(
  //     resp => {
  //       this.isLoading.next(false);
  //       this.storeHousesAdmin = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(sth => sth.type == 'vente')
  //     },
  //   )
  // }

  getStoreHouses(){
    this.loadStoreHouse = true
    this.mySubscription2 = this.storeHouseService.getAllStoreHousesWithPagination(0, 500, localStorage.getItem('store').toString(), 'vente').subscribe(
      resp => {
        // this.storeHouses2 = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content.filter(st => st.type == 'vente' && st.store.internalReference == (aesUtil.decrypt(key, localStorage.getItem('store').toString()) as number))
        this.storeHouses2 = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.loadStoreHouse = false
      },
    )
  }
  //save carton
  supplyNoteBook(){
    this.isLoading.next(true);
    this.supply.idCarton = aesUtil.encrypt(key, this.supplyForm.controls['idCarton'].value.toString()) as number;
    this.supply.idStoreHouseSell = aesUtil.encrypt(key, this.supplyForm.controls['idStoreHouseSell'].value.toString()) as number;

    const SupplyCarton = {
      "idCarton" : "",
      "idStoreHouseSell" : ""
    }
    setTimeout(() =>{
      const notif = 'Vous recevrez une notification une fois l\'opération terminée'
      Swal.fire({
        title: 'Opération en cours',
        html: 'Le système est entrain de créer les carnets et générer les coupons. '+ notif.toString().bold() ,
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        focusConfirm: false,
        timer: 3000,
        backdrop: `rgba(0, 0, 0, 0.4)`
      }).then((result) => {
        // if (result.value) {
        //   this.annuler()
        // }
      })
    }  , 1000);
    SupplyCarton.idCarton = this.supply.idCarton.toString();
    SupplyCarton.idStoreHouseSell = this.supply.idStoreHouseSell.toString();

    this.cartonService.createCartonSupply(SupplyCarton).subscribe(
      resp => {
        this.annuler()
        this.isLoading.next(false);
        this.getCartons();
        this.notifsService.onSuccess('approvisionnement effectué')
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

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
  }


}
