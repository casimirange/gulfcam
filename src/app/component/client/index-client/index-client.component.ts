import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Client} from "../../../_model/client";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClientService} from "../../../_services/clients/client.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {catchError, endWith, map, startWith} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {AppState} from "../../../_interfaces/app-state";
import {DataState} from "../../../_enum/data.state.enum";

@Component({
  selector: 'app-index-client',
  templateUrl: './index-client.component.html',
  styleUrls: ['./index-client.component.scss']
})
export class IndexClientComponent implements OnInit {

  clients: Client[] = [];
  client: Client = new Client();
  clientType: string;
  clientForm: FormGroup;
  appState$: Observable<AppState<CustomResponse<Client>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Client>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  name = ''
  compagny = ''
  date = ''
  internalRef = ''
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  roleUser = localStorage.getItem('userAccount').toString()
  modalTitle = 'Enregistrer nouveau client'


  @ViewChild('mymodal', {static: false}) viewMe?: ElementRef<HTMLElement>;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private clientService: ClientService, private router: Router,
              private notifService: NotifsService) {
    this.formClient();
  }

  ngOnInit(): void {
    this.getClients()
  }

  getClients() {
    this.appState$ = this.clientService.clients$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.notifService.onSuccess('chargement des clients')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number) {
    this.page = event
    this.appState$ = this.clientService.clients$(this.page - 1, this.size)
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

  formClient() {
    this.clientForm = this.fb.group({
      completeName: ['', [Validators.required, Validators.minLength(3)]],
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, ]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      gulfcamAccountNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      rccm: ['', [Validators.required, Validators.minLength(2)]],
      typeClient: ['', [Validators.required]],
    });
  }

  saveClient() {
    this.isLoading.next(true)
    this.client = this.clientForm.value
    // this.client.phone = this.clientForm.controls['phone'].value.e164Number
    this.appState$ = this.clientService.addClient$(this.client)
      .pipe(
        map((response ) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value , content: [response, ...this.dataSubjects.value.content]}
          )
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("nouveau client ajouté!")
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
    this.formClient();
    this.clientType = ''
    this.client = new Client()
    this.clientForm.reset()
    this.modalService.dismissAll()
    this.modalTitle = 'Enregistrer nouveau client'
  }

  open(content: any) {
    this.annuler()
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.modalTitle = 'Enregistrer nouveau client'
  }

  deleteClient(client: Client) {

    Swal.fire({
      title: 'Supprimer client',
      html: "Voulez-vous vraiment supprimer " + client.completeName.bold() + " de la liste de vos clients ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f6ad8',
      cancelButtonColor: '#d92550',
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
        this.deleteClients(client.internalReference)
      }
    })

  }

  detailsClient(client: Client) {
    this.router.navigate(['/clients/', client.internalReference])
  }

  updateClientModal(mymodal: TemplateRef<any>, client: Client) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.client = client
    this.clientType = client.typeClient.name
    this.modalTitle = 'Modifier client'
  }

  updateClient() {
    this.isLoading.next(true)
    this.appState$ = this.clientService.updateClient$(this.clientForm.value as Client, this.client.internalReference)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === response.internalReference)
          this.dataSubjects.value.content[index] = response
          this.isLoading.next(false)
          this.notifService.onSuccess("client modifié avec succès!")
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

  deleteClients(internalRef: number) {
    this.isLoading.next(true)
    this.appState$ = this.clientService.deleteClient$(internalRef)
      .pipe(
        map((response ) => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === internalRef)
          this.dataSubjects.value.content.splice(index, 1)
          this.isLoading.next(false)
          this.notifService.onSuccess("client supprimé avec succès!")
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  telInputObject($event: any) {
    console.log($event);
  }
}
