import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {catchError, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {MangwaService} from "../../../_services/mangwa/mangwa.service";
import {Mangwa} from "../../../_model/mangwa";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_model/user";

@Component({
  selector: 'app-index-mangwa',
  templateUrl: './index-mangwa.component.html',
  styleUrls: ['./index-mangwa.component.scss']
})
export class IndexMangwaComponent implements OnInit {

  @ViewChild('mymodal', { static: false }) viewMe?: ElementRef<HTMLElement>;
  mangwaForm: FormGroup ;
  mangwa: Mangwa = new Mangwa();

  appState$: Observable<AppState<CustomResponse<Mangwa>>>;
  soldeState$: Observable<AppState<number>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Mangwa>>(null);
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
  date = '';
  statusFilter = ''
  constructor(private fb: FormBuilder, private modalService: NgbModal, private notifService: NotifsService,
              private userService: UsersService, private mangwaservice: MangwaService) {

  }

  ngOnInit(): void {
    this.formMangwa();
    this.getMangwas();
    this.getSoldeMangwas();
    this.getUsers();
  }

  //formulaire de création
  formMangwa(){
    this.mangwaForm = this.fb.group({
      date: ['', [Validators.required]],
      user: ['', [Validators.required]],
      motif: ['', [Validators.required, Validators.minLength(10)]],
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
    });
  }

  getMangwas(){
    this.appState$ = this.mangwaservice.mangwas$(this.statusFilter,this.date,  this.page - 1, this.size)
      .pipe(
        map(response => {
          // console.log(response)
          this.dataSubjects.next(response)
          this.notifService.onSuccess('chargement des mangwa')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getSoldeMangwas(){
    this.soldeState$ = this.mangwaservice.soldeMangwa$()
      .pipe(
        map(response => {
          // console.log(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getUsers(){
    this.userService.getUserss().subscribe(
      resp => {
        this.users = resp
      }
    )
  }

  //save carton
  saveMangwa(){
    this.isLoading.next(true)
    this.mangwa = this.mangwaForm.value
    this.mangwa.transaction = "RETRAIT"
    this.appState$ = this.mangwaservice.addMangwa$(this.mangwa)
      .pipe(
        map((response ) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value , content: [response, ...this.dataSubjects.value.content]}
          )
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("nouvelle transaction effectuée!")
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
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
    this.mangwaForm.reset()
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
    // this.store = this.stores.find(store => store.localization === this.pretForm.controls['idStore'].value)
    // this.storeHouse = this.storeHouses.find(sth => sth.idStore == this.store.internalReference && sth.type === 'stockage')

    // this.carton.idStoreKeeper = parseInt(localStorage.getItem('uid').toString())
    // this.carton.idStoreHouse = this.storeHouse.internalReference
    // this.carton.serialNumber = this.pretForm.controls['serialNumber'].value
    // const updateCarton = {
    //   "idStoreKeeper" : 0,
    //   "serialNumber" : '',
    //   "idStoreHouse" : 0
    // }
    // updateCarton.idStoreKeeper = parseInt(localStorage.getItem('uid').toString())
    // updateCarton.idStoreHouse = this.pretForm.controls['idStoreHouse'].value
    // updateCarton.serialNumber = this.pretForm.controls['serialNumber'].value

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
    this.getMangwas()
  }
}
