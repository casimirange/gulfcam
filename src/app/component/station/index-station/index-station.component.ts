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
  @ViewChild('mymodal', { static: false }) viewMe?: ElementRef<HTMLElement>;
  stationForm: FormGroup ;
  modalTitle = 'Enregistrer une nouvelle station'
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  roleUser = localStorage.getItem('userAccount').toString()
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

  constructor(private fb: FormBuilder, private modalService: NgbModal, private stationService: StationService,
              private notifService: NotifsService, private statusService: StatusService, private router: Router,
              private userService: UsersService) {
    this.formStation();
  }

  ngOnInit(): void {
    this.getUsers();
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
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
    this.idManagerStation = this.role.includes('ROLE_SUPERADMIN') ? this.idManagerStation : localStorage.getItem('uid');
    this.appState$ = this.stationService.filterStation$(this.designation, this.localisation, this.pinCode, this.idManagerStation,this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  //récupération de la liste des stations
  getUsers(){
    const type = 'MANAGER_STATION';
    this.userService.getUsersByTypeAccount(type.toString()).subscribe(
      resp => {
        this.users = resp
      },
    )
  }

  //save store house
  saveStation(){
    this.isLoading.next(true)
    this.station = this.stationForm.value
    this.station.balance = 0;
    this.appState$ = this.stationService.addStation$(this.station)
      .pipe(
        map((response) => {
          // this.dataSubjects.next(
          //   {...this.dataSubjects.value, content: [response, ...this.dataSubjects.value.content]}
          // )
          this.getStations()
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("enregistrement effectué!")
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
    this.station.localization = this.stationForm.controls['localization'].value;
    this.station.designation = this.stationForm.controls['designation'].value;
    this.station.pinCode = this.stationForm.controls['pinCode'].value;
    this.station.managerStagion = this.stationForm.controls['managerStagion'].value;
    this.stationService.updateStation(this.stationForm.value, this.station.internalReference).subscribe(
      resp => {
        this.isLoading.next(false);
        // on recherche l'index du client dont on veut faire la modification dans liste des clients
        const index = this.stations.findIndex(station => station.internalReference === resp.internalReference);
        this.stations[ index ] = resp;
        this.modalTitle = 'Enregistrer une nouvelle station'
        this.notifService.onSuccess("station modifiée avec succès!")
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
    this.router.navigate(['/stations/details', station.internalReference])
  }

  ngOnDestroy(): void {
    // this.suscription.unsubscribe()
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
