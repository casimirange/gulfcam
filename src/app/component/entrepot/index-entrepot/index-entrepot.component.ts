import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreHouse} from "../../../_model/storehouse";
import {Store} from "../../../_model/store";
import {StoreService} from "../../../_services/store/store.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {BehaviorSubject} from "rxjs";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {StatusService} from "../../../_services/status/status.service";
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-index-entrepot',
  templateUrl: './index-entrepot.component.html',
  styleUrls: ['./index-entrepot.component.scss']
})
export class IndexEntrepotComponent implements OnInit {

  storeHouses: StoreHouse[] = [];
  storeHousesByStore: StoreHouse[] = [];
  storeHouse: StoreHouse = new StoreHouse();
  @ViewChild('mymodal', { static: false }) viewMe?: ElementRef<HTMLElement>;
  storeHouseForm: FormGroup ;
  storeHouseType = ['stockage', 'vente']
  stores: Store[] = [];
  store: Store = new Store();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer un nouvel entrepot'
  magasin: string
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
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
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
      },
      // error => {
        // this.notifService.onError(error.error.message, 'Erreur de chargement des magasins')
      // }
    )
  }

  //récupération de la liste des entrepots
  getStoreHouses(){
    this.storeHouseService.getAllStoreHousesWithPagination(this.page-1, this.size).subscribe(
      response => {
        console.log(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
        this.storeHouses = JSON.parse(aesUtil.decrypt(key,response.key.toString())).content
        this.storeHousesByStore = JSON.parse(aesUtil.decrypt(key,response.key.toString())).content.filter(sh => sh.store.internalReference === parseInt(aesUtil.decrypt(key, localStorage.getItem('store'))))
        console.log(this.storeHousesByStore)
        this.size = JSON.parse(aesUtil.decrypt(key,response.key.toString())).size
        this.totalPages = JSON.parse(aesUtil.decrypt(key,response.key.toString())).totalPages
        this.totalElements = JSON.parse(aesUtil.decrypt(key,response.key.toString())).totalElements
        this.notifService.onSuccess('chargement des entrepots')
      },
      // error => {
      //   this.notifService.onError(error.error.message, 'Erreur de chargement des magasins')
      // }
    )
  }

  //save store house
  saveStoreHouse(){
    this.isLoading.next(true);
    this.store = this.stores.find(store => store.localization === this.storeHouseForm.controls['store'].value)
    this.storeHouse.idStore = aesUtil.encrypt(key, this.store.internalReference.toString())
    this.storeHouse.type = aesUtil.encrypt(key, this.storeHouseForm.controls['type'].value.toString())
    this.storeHouse.name = aesUtil.encrypt(key, this.storeHouseForm.controls['name'].value.toString())
    this.storeHouseService.createStoreHouse(this.storeHouse).subscribe(
      resp => {
        /**
         * je dois gérer cette partie
         */
        // this.storeHouses.push(resp)
        this.getStoreHouses()
        this.isLoading.next(false);
        this.notifService.onSuccess('enregistrement effectué')
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
        // this.notifService.onError(error.error.message, 'Erreur lors de la création')
      }
    )
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
    console.log('magasin', this.stores.find(store => store.internalReference === storeHouse.idStore))
    // this.magasin = this.stores.find(store => store.internalReference === storeHouse.idStore).localization
    this.modalTitle = 'Modifier entrepot'
  }

  updateStoreHouse() {
    this.isLoading.next(true);
    this.store = this.stores.find(store => store.localization === this.storeHouseForm.controls['store'].value)
    console.log(this.store)
    const updateStoreHouse = {
      "idStore" : 0,
      "type" : '',
      "name" : '',
    }
    updateStoreHouse.type = aesUtil.encrypt(key, this.storeHouseForm.controls['type'].value.toString())
    updateStoreHouse.name = aesUtil.encrypt(key, this.storeHouseForm.controls['name'].value.toString())
    updateStoreHouse.idStore = aesUtil.encrypt(key, this.store.internalReference.toString())

    this.storeHouseService.updateStoreHouse(updateStoreHouse, aesUtil.encrypt(key, this.storeHouse.internalReference.toString())).subscribe(
      res => {
        this.isLoading.next(false);
        // on recherche l'index du client dont on veut faire la modification dans liste des clients
        const index = this.storeHouses.findIndex(storeHouse => storeHouse.internalReference === JSON.parse(aesUtil.decrypt(key,res.key.toString())).internalReference);
        // this.storeHouses[ index ] = resp;
        this.storeHouses[ index ].internalReference = JSON.parse(aesUtil.decrypt(key,res.key.toString())).internalReference;
        this.storeHouses[ index ].localisationStore = JSON.parse(aesUtil.decrypt(key,res.key.toString())).localisationStore;
        this.storeHouses[ index ].name = JSON.parse(aesUtil.decrypt(key,res.key.toString())).name;
        this.storeHouses[ index ].updateAt = JSON.parse(aesUtil.decrypt(key,res.key.toString())).updateAt;
        this.getStoreHouses()
        this.notifService.onSuccess("entrepot modifié avec succès!")
        this.modalTitle = 'Enregistrer un nouvel entrepot'
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
        // if (error.error.message.includes('JWT expired')){
        //
        // }else {
        //   this.notifService.onError(error.error.message, '')
        // }
      }
    )
  }

  showDetails(storeHouse: StoreHouse) {
    this.router.navigate(['/entrepots/details', aesUtil.encrypt(key, storeHouse.internalReference.toString())])
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.getStores()
  }
}
