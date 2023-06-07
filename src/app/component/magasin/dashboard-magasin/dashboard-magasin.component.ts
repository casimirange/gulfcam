import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {Store} from "../../../_model/store";
import {StoreService} from "../../../_services/store/store.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import Swal from "sweetalert2";
import {UnitsService} from "../../../_services/units/units.service";
import {StoreHouse} from "../../../_model/storehouse";
import {Router} from "@angular/router";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {StatusService} from "../../../_services/status/status.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {catchError, map, startWith} from "rxjs/operators";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {AppState} from "../../../_interfaces/app-state";
import {DataState} from "../../../_enum/data.state.enum";

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
  store1: Store = new Store ();
  appState$: Observable<AppState<CustomResponse<Store>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Store>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouveau magasin';
  page: number = 1;
  storeFiltered = '';
  size: number = 10;
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService, private router: Router,
              private notifService: NotifsService, private unitService: UnitsService, private voucherService: VoucherService,
              private storehouseService: StoreHouseService, private statusService: StatusService) {
    this.formStore();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
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
    this.store1.localization = aesUtil.encrypt(key, this.storeForm.controls['localization'].value.toString())
    this.isLoading.next(true);
    this.appState$ = this.storeService.addStore$(this.store1)
      .pipe(
        map((response) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value, content: [JSON.parse(aesUtil.decrypt(key,response.key.toString())), ...this.dataSubjects.value.content]}
          )
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("nouveau magasin ajouté!")
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getStores(){
    this.storeFiltered = this.role.includes('ROLE_SUPERADMIN') ? '' : localStorage.getItem('store')
    this.appState$ = this.storeService.store$(this.page - 1, this.size, this.storeFiltered)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Store>)
          this.notifService.onSuccess('Chargement des magasins')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Store>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
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
    this.storehouseService.getStoreHousesByStore(aesUtil.encrypt(key, store.internalReference.toString())).subscribe(
      resp => {
        this.storeHouses = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
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
    this.store1.localization = aesUtil.encrypt(key, this.storeForm.controls['localization'].value.toString())
    let rout = aesUtil.encrypt(key, this.store.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, this.store.internalReference.toString())
    }
    this.appState$ = this.storeService.updateStore$(this.store1, rout as number)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === JSON.parse(aesUtil.decrypt(key,response.key.toString())).internalReference)
          this.dataSubjects.value.content[index] = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
          this.isLoading.next(false)
          this.notifService.onSuccess("magasin modifié avec succès!")
          this.annuler()
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  showDetails(store: Store) {
    let rout = aesUtil.encrypt(key, store.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, store.internalReference.toString())
    }
    this.router.navigate(['/magasins/details', rout])
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

  pageChange(event: number) {
    this.page = event
    this.appState$ = this.storeService.store$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Store>)
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Store>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }
}
