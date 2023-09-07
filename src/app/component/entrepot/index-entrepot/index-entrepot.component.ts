import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreHouse} from "../../../_model/storehouse";
import {Store} from "../../../_model/store";
import {StoreService} from "../../../_services/store/store.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {StatusService} from "../../../_services/status/status.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-index-entrepot',
  templateUrl: './index-entrepot.component.html',
  styleUrls: ['./index-entrepot.component.scss']
})
export class IndexEntrepotComponent implements OnInit, OnDestroy {

  storeHouses: StoreHouse[] = [];
  storeHousesByStore: StoreHouse[] = [];
  storeHouse: StoreHouse = new StoreHouse();
  storeHouse2: StoreHouse = new StoreHouse();
  @ViewChild('mymodal', { static: false }) viewMe?: ElementRef<HTMLElement>;
  storeHouseForm: FormGroup ;
  storeHouseType = ['stockage', 'vente']
  stores: Store[] = [];
  store: Store = new Store();
  appState$: Observable<AppState<CustomResponse<StoreHouse>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<StoreHouse>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer un nouvel entrepot'
  magasin: string
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  page: number = 1;
  storeFilter = '';
  size: number = 10;
  load: boolean
  private mySubscription: Subscription;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private storeHouseService: StoreHouseService,
              private storeService: StoreService, private notifService: NotifsService, private router: Router,
              private statusService: StatusService) {
    this.formStoreHouse();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getStores();
    this.getStoreHouses();
  }

  //formulaire de création
  formStoreHouse(){
    this.storeHouseForm = this.fb.group({
      store: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  //récupération de la liste des magasins
  getStores(){
    this.load = true
    this.mySubscription = this.storeService.getStore().subscribe(
      resp => {
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.load = false
      },
      error => {
        // this.notifService.onError(error.error.message, 'Erreur de chargement des magasins')
        this.load = false
      }
    )
  }

  //récupération de la liste des entrepots
  getStoreHouses(){
    // console.log(aesUtil.decrypt(key, localStorage.getItem('store')))

    this.storeFilter = this.role.includes('ROLE_SUPERADMIN') ? '' : localStorage.getItem('store');
    // console.log(this.storeFilter)
    const type = ''
    this.appState$ = this.storeHouseService.storeHouse$(this.page - 1, this.size, this.storeFilter, type)
      .pipe(
        map(response => {
          // console.log(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<StoreHouse>)
          this.notifService.onSuccess('Chargement des entrepots')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<StoreHouse>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  //save store house
  saveStoreHouse(){
    this.isLoading.next(true);
    // this.store = this.stores.find(store => store.localization === )
    this.storeHouse2.idStore = aesUtil.encrypt(key, this.storeHouseForm.controls['store'].value.toString())
    this.storeHouse2.type = aesUtil.encrypt(key, this.storeHouseForm.controls['type'].value.toString())
    this.storeHouse2.name = aesUtil.encrypt(key, this.storeHouseForm.controls['name'].value.toString())
    this.appState$ = this.storeHouseService.addStoreHouse$(this.storeHouse2)
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

    // this.storeHouseService.createStoreHouse(this.storeHouse2).subscribe(
    //   resp => {
    //     /**
    //      * je dois gérer cette partie
    //      */
    //     // this.storeHouses.push(resp)
    //     this.annuler()
    //     this.getStoreHouses()
    //     this.isLoading.next(false);
    //     this.notifService.onSuccess('enregistrement effectué')
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //     // this.notifService.onError(error.error.message, 'Erreur lors de la création')
    //   }
    // )
  }

  annuler() {
    this.formStoreHouse();
    this.storeHouse = new StoreHouse()
    this.modalService.dismissAll()
    this.magasin = ''
    this.modalTitle = 'Enregistrer un nouvel entrepot'
  }
  //open modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  deleteStoreHouse(storeHouse: StoreHouse, index: number) {
      Swal.fire({
        title: 'Supprimer entrepot',
        html: "Voulez-vous vraiment supprimer "+ storeHouse.internalReference.toString().bold() + " de la liste de vos entrepots ?",
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
          this.isLoading.next(true)
          this.storeHouseService.deleteStoreHouse(storeHouse.internalReference).subscribe(
            resp => {
              this.storeHouses.splice(index, 1)
              this.isLoading.next(false)
              this.notifService.onSuccess(`entrepot ${storeHouse.internalReference.toString().bold()} supprimé avec succès !`)
            },error => {
              this.isLoading.next(false);
              // if (error.error.message.includes('JWT expired')){
              //
              // }else {
              //   this.notifService.onError(error.error.message, '')
              // }
            }
          )
        }
      })
  }

  updateStoreHouseModal(mymodal: TemplateRef<any>, storeHouse: StoreHouse) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.storeHouse = storeHouse
    // console.log('magasin', this.stores.find(store => store.internalReference === storeHouse.idStore))
    // this.magasin = this.stores.find(store => store.internalReference === storeHouse.idStore).localization
    this.modalTitle = 'Modifier entrepot'
  }

  updateStoreHouse() {
    this.isLoading.next(true);
    // this.store = this.stores.find(store => store.localization === )
    const updateStoreHouse = {
      "idStore" : 0,
      "type" : '',
      "name" : '',
    }
    updateStoreHouse.type = aesUtil.encrypt(key, this.storeHouseForm.controls['type'].value.toString())
    updateStoreHouse.name = aesUtil.encrypt(key, this.storeHouseForm.controls['name'].value.toString())
    updateStoreHouse.idStore = aesUtil.encrypt(key, this.storeHouseForm.controls['store'].value.toString())
    let rout = aesUtil.encrypt(key, this.storeHouse.internalReference.toString())
    while (rout.includes('/')) {
      rout = aesUtil.encrypt(key, this.storeHouse.internalReference.toString())
    }
    this.appState$ = this.storeHouseService.updateStoreHouse$(updateStoreHouse, rout as number)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === JSON.parse(aesUtil.decrypt(key,response.key.toString())).internalReference)
          this.dataSubjects.value.content[index] = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
          this.isLoading.next(false)
          this.notifService.onSuccess("entrepot modifié avec succès!")
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

  showDetails(storeHouse: StoreHouse) {
    let rout = aesUtil.encrypt(key, storeHouse.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, storeHouse.internalReference.toString())
    }
    this.router.navigate(['/entrepots/details', rout])
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.storeFilter = this.role.includes('ROLE_SUPERADMIN') ? '' : localStorage.getItem('store');
    const type = ''
    this.appState$ = this.storeHouseService.storeHouse$(this.page - 1, this.size, this.storeFilter, type)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<StoreHouse>)
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<StoreHouse>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null
  }
}
