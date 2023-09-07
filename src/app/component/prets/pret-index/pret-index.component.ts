import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {IUser} from "../../../_model/user";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UsersService} from "../../../_services/users/users.service";
import {catchError, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {Pret} from "../../../_model/pret";
import {PretsService} from "../../../_services/pret/prets.service";

@Component({
  selector: 'app-pret-index',
  templateUrl: './pret-index.component.html',
  styleUrls: ['./pret-index.component.css']
})
export class PretIndexComponent implements OnInit {
  pretForm: FormGroup ;
  pret: Pret;
  selectedPret: Pret;
  appState$: Observable<AppState<CustomResponse<Pret>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Pret>>(null);
  users: CustomResponse<IUser>;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer un nouveau carton'
  nc: number;
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  roleUser = localStorage.getItem('userAccount').toString()
  options = [{name: "Partiel", value: false}, {name: "Total", value: true}];
  selectedOption: string| undefined;
  loadUser: boolean = false
  date = '';
  userFilter = ''
  statusFilter = ''
  constructor(private fb: FormBuilder, private modalService: NgbModal, private notifService: NotifsService,
              private userService: UsersService, private pretService: PretsService) {

  }

  ngOnInit(): void {
    this.formMangwa();
    this.getPrets();
    // this.getSoldeMangwas();
    this.getUsers();
  }

  //formulaire de création
  formMangwa(){
    this.pretForm = this.fb.group({
      date: ['', [Validators.required]],
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
      type: ['', [Validators.required, ]],
    });
  }

  getPrets(){
    this.appState$ = this.pretService.prets$(this.userFilter, this.statusFilter, this.date, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.notifService.onSuccess('chargement des prêts')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getUsers(){
    this.loadUser = true
    this.userService.getUserss().subscribe(
      resp => {
        this.loadUser = false
        this.users = resp
      }
    )
  }

  //save carton
  rembourser(){
    this.isLoading.next(true)
    // this.pret = this.pretForm.value
    // this.pret.typeTransaction.name = "RETRAIT"
    this.pret.idUser = this.selectedPret.idUser
    this.pret.dateRemboursement = this.pretForm.controls['date'].value
    this.pret.montant_rembourse = this.pretForm.controls['montant'].value
    this.pret.total = this.pretForm.controls['type'].value
    this.appState$ = this.pretService.rembourserPret$(this.pret, this.selectedPret.idPret)
      .pipe(
        map((response ) => {
          // this.dataSubjects.next(
          //   {...this.dataSubjects.value , content: [response, ...this.dataSubjects.value.content]}
          // )
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("prêt remboursé")
          this.getPrets()
          return {dataState: DataState.LOADED_STATE, appData: null}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }


  annuler() {
    this.formMangwa();
    this.pretForm.reset()
    this.modalService.dismissAll()
  }

  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  // updateCartonModal(mymodal: TemplateRef<any>, carton: Carton) {
    // this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    // this.carton = carton
    // // this.sn = carton.serialNumber
    // console.log('magasin', this.stores.find(store => store.internalReference === carton.idStoreHouseStockage))
    // this.storeHouse = this.storeHouses.find(store => store.internalReference === carton.idStoreHouseStockage)
    // this.entrepot = this.storeHouse.name
    // this.magasin = this.stores.find(store => store.internalReference === this.storeHouse.idStore).localization
    // this.modalTitle = 'Modifier carton'
  // }

  updateCarton() {
    // this.isLoading.next(true);
    // // this.store = this.stores.find(store => store.localization === this.pretForm.controls['idStore'].value)
    // // this.storeHouse = this.storeHouses.find(sth => sth.idStore == this.store.internalReference && sth.type === 'stockage')
    //
    // // this.carton.idStoreKeeper = parseInt(localStorage.getItem('uid').toString())
    // // this.carton.idStoreHouse = this.storeHouse.internalReference
    // // this.carton.serialNumber = this.pretForm.controls['serialNumber'].value
    // const updateCarton = {
    //   "idStoreKeeper" : 0,
    //   "serialNumber" : '',
    //   "idStoreHouse" : 0
    // }
    // updateCarton.idStoreKeeper = parseInt(localStorage.getItem('uid').toString())
    // // updateCarton.idStoreHouse = this.pretForm.controls['idStoreHouse'].value
    // // updateCarton.serialNumber = this.pretForm.controls['serialNumber'].value
    //
    // this.cartonService.updateCarton(updateCarton, this.carton.internalReference).subscribe(
    //   resp => {
    //     this.isLoading.next(false);
    //     // on recherche l'index du client dont on veut faire la modification dans liste des clients
    //     const index = this.cartons.findIndex(carton => carton.internalReference === resp.internalReference);
    //     this.cartons[ index ] = resp;
    //     this.notifService.onSuccess("carton modifié avec succès!")
    //     this.annuler()
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //   }
    // )
  }

  pageChange(event: number){
    this.page = event
    this.getPrets()
  }

}
