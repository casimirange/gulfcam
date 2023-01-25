import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {Store} from "../../../_model/store";
import {StoreService} from "../../../_services/store/store.service";
import {BehaviorSubject} from "rxjs";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {PaiementMethod} from "../../../_model/paiement";
import Swal from "sweetalert2";
import {UnitsService} from "../../../_services/units/units.service";
import {Unite} from "../../../_model/unite";
import {StoreHouse} from "../../../_model/storehouse";
import {Router} from "@angular/router";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {environment} from "../../../../environments/environment";
import {StatusService} from "../../../_services/status/status.service";

@Component({
  selector: 'app-dashboard-magasin',
  templateUrl: './dashboard-magasin.component.html',
  styleUrls: ['./dashboard-magasin.component.scss']
})
export class DashboardMagasinComponent implements OnInit {

  storeForm: FormGroup;
  stores: Store[] = [];
  storeFilter: Store[] = [];
  storeHouses: StoreHouse[] = [];
  store: Store = new Store ();
  unit: Unite = new Unite();
  typeVouchers: TypeVoucher[]
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouveau magasin';
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  roleUser = localStorage.getItem('userAccount').toString()
  role: string[] = []
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService, private router: Router,
              private notifService: NotifsService, private unitService: UnitsService, private voucherService: VoucherService,
              private storehouseService: StoreHouseService, private statusService: StatusService) {
    this.formStore();
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
  }

  ngOnInit(): void {
    this.getStores();
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

  createStore(){
    console.log(this.storeForm.value)
    this.getVouchers()
    this.store.localization = this.storeForm.value
    this.isLoading.next(true);
    this.storeService.createStore(this.storeForm.value as Store).subscribe(
      resp => {
        console.log(resp)
        // this.unit.idStore = resp.internalReference
        // this.unit.quantityNotebook = 0
        // this.typeVouchers.forEach(tv => {
        //   this.unit.idTypeVoucher = tv.internalReference
        //   this.unitService.createUnit(this.unit).subscribe()
        // })
        this.stores.push(resp)
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('enregistrement effectué')
      },
      error => {
        this.notifService.onError(error.error.message, '')
        this.isLoading.next(false);
      }
    )
  }

  getStores(){
    console.log(this.storeForm.value)
    this.storeService.getAllStoresWithPagination(this.page-1, this.size).subscribe(
      resp => {
        this.stores = resp.content
        this.storeFilter = resp.content.filter(sh => sh.internalReference === parseInt(localStorage.getItem('store')))
        this.size = resp.size
        this.totalPages = resp.totalPages
        this.totalElements = resp.totalElements
        this.notifService.onSuccess('Chargement des magasins')
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
    this.modalTitle = 'Enregistrer nouveau magasin'
  }

  delete(store: Store, index:number) {
    this.isLoading.next(true);
    //on supprime les entrepôts rattachés au magasin
    this.storehouseService.getStoreHousesByStore(store.internalReference).subscribe(
      resp => {
        this.storeHouses = resp.content
        this.deleteStoreHousesByStore(this.storeHouses);
      }
    )

    this.storeService.deleteStore(store.internalReference).subscribe(
      resp => {
        // console.log(resp)
        this.stores.splice(index, 1)
        this.isLoading.next(false);
        this.notifService.onSuccess("magasin de "+store.localization+" supprimé")
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
        this.modalTitle = 'Enregistrer nouveau magasin'
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  showDetails(store: Store) {
    this.router.navigate(['/magasins/details', store.internalReference])
    // [routerLink]=""
  }

  private deleteStoreHousesByStore(storeHouses: StoreHouse[]) {
    for (let storeHouse of storeHouses){
      this.storehouseService.deleteStoreHouse(storeHouse.internalReference).subscribe()
      this.notifService.onSuccess("entrepôt "+storeHouse.name+" supprimé")
    }
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.getStores()
  }
}
