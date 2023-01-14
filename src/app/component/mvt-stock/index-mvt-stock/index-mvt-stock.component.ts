import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {Unite} from "../../../_model/unite";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {BehaviorSubject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreService} from "../../../_services/store/store.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UnitsService} from "../../../_services/units/units.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import Swal from "sweetalert2";
import {Stock} from "../../../_model/stock";
import {MvtStockService} from "../../../_services/stock/mvt-stock.service";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {StoreHouse} from "../../../_model/storehouse";

@Component({
  selector: 'app-index-mvt-stock',
  templateUrl: './index-mvt-stock.component.html',
  styleUrls: ['./index-mvt-stock.component.css']
})
export class IndexMvtStockComponent implements OnInit {

  storeForm: FormGroup;
  stores: Store[] = [];
  storeHouses: StoreHouse[] = [];
  store: Store = new Store ();
  mvtStocks: Stock[] = [];
  mvtStock: Stock = new Stock();
  unit: Unite = new Unite();
  typeVouchers: TypeVoucher[]
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouveau magasin';
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  roleUser = localStorage.getItem('userAccount').toString()
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService,
              private storeHouseService: StoreHouseService, private notifService: NotifsService, private unitService: UnitsService,
              private voucherService: VoucherService, private mvtStockService: MvtStockService) {
    this.formStore();
  }

  ngOnInit(): void {
    // this.getStores();
    // this.getStoreHousess();
    this.getMvtStocks();
  }

  //initialisation du formulaire de création type de bon
  formStore(){
    this.storeForm = this.fb.group({
      localization: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  //ouverture du modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
  }

  getStores(){
    console.log(this.storeForm.value)
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
    )
  }

  getStoreHousess(){
    console.log(this.storeForm.value)
    this.storeHouseService.getStoreHouses().subscribe(
      resp => {
        this.storeHouses = resp.content
      },
    )
  }

  getMvtStocks(){
    console.log(this.storeForm.value)
    this.mvtStockService.getStockMovement().subscribe(
      resp => {
        this.mvtStocks = resp.content
        this.size = resp.size
        this.totalPages = resp.totalPages
        this.totalElements = resp.totalElements
        console.log(this.mvtStocks)
        this.notifService.onSuccess('chargement des mouvements du stock')
      },
    )
  }

  getVouchers(){
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        this.typeVouchers = resp.content
      },
    )
  }
  annuler() {
    this.formStore();
    this.store = new Store()
    this.modalService.dismissAll()
  }

  delete(store: Store, index:number) {
    this.isLoading.next(true);
    this.storeService.deleteStore(store.internalReference).subscribe(
      resp => {
        // console.log(resp)
        this.stores.splice(index, 1)
        this.isLoading.next(false);
        this.notifService.onSuccess("magasin de "+store.localization+" supprimé")
      },
      error => {
        // this.notifServices.onError(error.error.message,"échec de suppression")
        this.isLoading.next(false);
      }
    )
  }

  deleteStore(store: Store, index: number) {
    Swal.fire({
      title: 'Supprimer Magasin',
      html: "Voulez-vous vraiment supprimer le magasin de "+ store.localization.toString().bold() + " ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00ace6',
      cancelButtonColor: '#f65656',
      confirmButtonText: 'OUI',
      cancelButtonText: 'NON',
      allowOutsideClick: true,
      focusConfirm: false,
      focusCancel: true,
      focusDeny: true,
      backdrop: `rgba(0, 0, 0, 0.4)`,
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        this.delete(store, index)
      }
    })
  }

  updateStoreModal(mymodal: TemplateRef<any>, store: Store) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    this.store = store
    this.modalTitle = 'Modifier magasin'
  }

  updateStore() {
    this.isLoading.next(true);
    console.log(this.storeForm.controls['localization'].value)
    this.storeService.updateStore(this.storeForm.value, this.store.internalReference).subscribe(
      resp => {
        this.isLoading.next(false);
        const index = this.stores.findIndex(store => store.internalReference === resp.internalReference);
        this.stores[ index ] = resp;
        this.notifService.onSuccess("magasin modifié avec succès!")
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

}
