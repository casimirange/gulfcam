import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Subscription} from "rxjs";
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

@Component({
  selector: 'app-index-station',
  templateUrl: './index-station.component.html',
  styleUrls: ['./index-station.component.scss']
})
export class IndexStationComponent implements OnInit, OnDestroy {

  stations: Station[] = [];
  users: ISignup[] = [];
  station: Station = new Station();
  @ViewChild('mymodal', { static: false }) viewMe?: ElementRef<HTMLElement>;
  stationForm: FormGroup ;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer une nouvelle station'
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  roleUser = localStorage.getItem('userAccount').toString()
  suscription: Subscription;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private stationService: StationService,
              private notifService: NotifsService, private statusService: StatusService, private router: Router,
              private userService: UsersService) {
    this.formStation();
  }

  ngOnInit(): void {
    this.getStations();
    this.getUsers();

    this.suscription = this.stationService.refresh$.subscribe(() => {
      this.getStations()
    })

  }

  //formulaire de création
  formStation(){
    this.stationForm = this.fb.group({
      localization: ['', [Validators.required, Validators.minLength(3)]],
      designation: ['', [Validators.required, Validators.minLength(3)]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      managerStation: ['', [Validators.required]],
    });
  }

  //récupération de la liste des stations
  getStations(){
    this.stationService.getAllStationWithPagination(this.page-1, this.size).subscribe(
      resp => {
        this.stations = resp.content
        this.size = resp.size
        this.totalPages = resp.totalPages
        this.totalElements = resp.totalElements
        this.notifService.onSuccess('chargement des stations')
      },
    )
  }

  //récupération de la liste des stations
  getUsers(){
    this.userService.getAllUsersWithPagination(this.page-1, 100).subscribe(
      resp => {
        console.log(resp)
        this.users = resp.content
        this.users = this.users.filter(user => user.typeAccount.name === 'MANAGER_STATION')
      },
    )
  }

  //save store house
  saveStation(){
    this.isLoading.next(true);
    this.station.balance = 0;
    this.station.localization = this.stationForm.controls['localization'].value;
    this.station.designation = this.stationForm.controls['designation'].value;
    this.station.pinCode = this.stationForm.controls['pinCode'].value;
    this.station.managerStagion = this.stationForm.controls['managerStation'].value;

    this.stationService.createStation(this.station).subscribe(
      resp => {
        // this.stations.push(resp)
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
    this.suscription.unsubscribe()
  }
}
