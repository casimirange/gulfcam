import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import Swal from "sweetalert2";
import {StationService} from "../../../_services/stations/station.service";
import {Station} from "../../../_model/station";
import {StatusService} from "../../../_services/status/status.service";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_model/user";
import {ISignup} from "../../../_model/signup";
import {Router} from "@angular/router";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Client} from "../../../_model/client";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-index-station',
  templateUrl: './index-station.component.html',
  styleUrls: ['./index-station.component.scss']
})
export class IndexStationComponent implements OnInit, OnDestroy {

  stations: Station[] = [];
  userStations: Station[] = [];
  users: ISignup[] = [];
  station: Station = new Station();
  station1: Station = new Station();
  @ViewChild('mymodal', { static: false }) viewMe?: ElementRef<HTMLElement>;
  stationForm: FormGroup ;
  modalTitle = 'Enregistrer une nouvelle station'
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  suscription: Subscription;
  appState$: Observable<AppState<CustomResponse<Station>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Station>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  onFilter: boolean = false;
  designation? = ''
  localisation? = ''
  idManagerStation? = ''
  pinCode? = ''
  private mySubscription: Subscription;
  load: boolean

  constructor(private fb: FormBuilder, private modalService: NgbModal, private stationService: StationService,
              private notifService: NotifsService, private statusService: StatusService, private router: Router,
              private userService: UsersService) {
    this.formStation();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getStations();
    // this.suscription = this.stationService.refresh$.subscribe(() => {
    //   this.getStations()
    // })

  }

  //formulaire de création
  formStation(){
    this.stationForm = this.fb.group({
      localization: ['', [Validators.required, Validators.minLength(3)]],
      designation: ['', [Validators.required, Validators.minLength(3)]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      managerStagion: ['', [Validators.required]],
    });
  }

  //récupération de la liste des stations
  getStations(){
    this.idManagerStation = this.role.includes('ROLE_SUPERADMIN') ? this.idManagerStation : aesUtil.decrypt(key, localStorage.getItem('uid'));
    this.appState$ = this.stationService.filterStation$(this.designation, this.localisation, this.pinCode, this.idManagerStation,this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  //récupération de la liste des stations
  getUsers(){
    this.load = true
    const type = 'MANAGER_STATION';
    this.mySubscription = this.userService.getUsersByTypeAccount(type.toString()).subscribe(
      resp => {
        this.users = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))
        this.load = false
      },
    )
  }

  //save store house
  saveStation(){
    this.isLoading.next(true)
    const balance = 0;
    this.station1.managerStagion = aesUtil.encrypt(key, this.stationForm.controls['managerStagion'].value.toString())
    this.station1.pinCode = aesUtil.encrypt(key, this.stationForm.controls['pinCode'].value.toString())
    this.station1.designation = aesUtil.encrypt(key, this.stationForm.controls['designation'].value.toString())
    this.station1.localization = aesUtil.encrypt(key, this.stationForm.controls['localization'].value.toString())
    this.station1.balance = aesUtil.encrypt(key, balance.toString());
    this.appState$ = this.stationService.addStation$(this.station1)
      .pipe(
        map((response) => {
          // this.dataSubjects.next(
          //   {...this.dataSubjects.value, content: [response, ...this.dataSubjects.value.content]}
          // )
          this.notifService.onSuccess("enregistrement effectué!")
          this.getStations()
          this.annuler()
          this.isLoading.next(false)
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )

    // this.isLoading.next(true);
    // this.station.balance = 0;
    // this.station.localization = this.stationForm.controls['localization'].value;
    // this.station.designation = this.stationForm.controls['designation'].value;
    // this.station.pinCode = this.stationForm.controls['pinCode'].value;
    // this.station.managerStagion = this.stationForm.controls['managerStagion'].value;
    //
    // this.stationService.createStation(this.station).subscribe(
    //   resp => {
    //     this.getStations()
    //     this.isLoading.next(false);
    //     this.notifService.onSuccess('enregistrement effectué')
    //     this.annuler()
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //     // this.notifService.onError(error.error.message, 'Erreur lors de la création')
    //   }
    // )
  }

  annuler() {
    this.formStation();
    this.station = new Station()
    this.modalTitle = 'Enregistrer une nouvelle station'
    this.modalService.dismissAll()
  }
  //open modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  updateStationModal(mymodal: TemplateRef<any>, station: Station) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.station = station
    this.modalTitle = 'Modifier station'
  }

  updateStation() {
    this.isLoading.next(true);
    const balance = 0;
    let rout = aesUtil.encrypt(key, this.station.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, this.station.internalReference.toString())
    }
    this.station1.managerStagion = aesUtil.encrypt(key, this.stationForm.controls['managerStagion'].value.toString())
    this.station1.pinCode = aesUtil.encrypt(key, this.stationForm.controls['pinCode'].value.toString())
    this.station1.designation = aesUtil.encrypt(key, this.stationForm.controls['designation'].value.toString())
    this.station1.localization = aesUtil.encrypt(key, this.stationForm.controls['localization'].value.toString())
    this.station1.balance = aesUtil.encrypt(key, balance.toString());
    this.stationService.updateStation(this.station1, rout).subscribe(
      resp => {
        this.isLoading.next(false);
        // on recherche l'index du client dont on veut faire la modification dans liste des clients
        const index = this.stations.findIndex(station => station.internalReference === JSON.parse(aesUtil.decrypt(key,resp.key.toString())).internalReference);
        this.stations[ index ] = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
        this.modalTitle = 'Enregistrer une nouvelle station'
        this.notifService.onSuccess("station modifiée avec succès!")
        this.getStations()
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.getStations()
  }

  showDetails(station: Station) {
    let rout = aesUtil.encrypt(key, station.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, station.internalReference.toString())
    }
    this.router.navigate(['/stations/details', rout])
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null
  }

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter) {
      this.designation = '';
      this.localisation = '';
      this.pinCode = '';
      this.idManagerStation = '';
      this.getStations()
    }
  }
}
