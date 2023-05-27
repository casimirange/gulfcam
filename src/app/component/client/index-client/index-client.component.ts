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
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-index-client',
  templateUrl: './index-client.component.html',
  styleUrls: ['./index-client.component.scss']
})
export class IndexClientComponent implements OnInit {

  clients: Client[] = [];
  client: Client = new Client();
  client2: Client = new Client();
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
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  modalTitle = 'Enregistrer nouveau client'
  @ViewChild('mymodals', {static: false}) viewMe?: ElementRef<HTMLElement>;
  onFilter: boolean = false;
  dateFilter? = ''
  typeFilter? = ''
  clientNameFilter? = ''
  companyNameFilter? = ''

  constructor(private fb: FormBuilder, private modalService: NgbModal, private clientService: ClientService, private router: Router,
              private notifService: NotifsService) {
    this.formClient();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getClients()
  }

  getClients() {
    this.appState$ = this.clientService.clients$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Client>)
          this.notifService.onSuccess('chargement des clients')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Client>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number) {
    this.page = event
    this.appState$ = this.clientService.filterClient$(this.companyNameFilter, this.typeFilter, this.clientNameFilter, this.dateFilter, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          // this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
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
      companyName: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required,]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      gulfcamAccountNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      rccm: [''],
      niu: [''],
      typeClient: ['', [Validators.required]],
    });
  }

  saveClient() {
    this.isLoading.next(true)
    this.client2.completeName = aesUtil.encrypt(key, this.clientForm.controls['completeName'].value.toString())
    this.client2.companyName = this.clientForm.controls['companyName'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['companyName'].value.toString()) : ''
    this.client2.email = this.clientForm.controls['email'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['email'].value.toString()) : ''
    this.client2.phone = aesUtil.encrypt(key, this.clientForm.controls['phone'].value.toString())
    this.client2.address = aesUtil.encrypt(key, this.clientForm.controls['address'].value.toString())
    this.client2.gulfcamAccountNumber = aesUtil.encrypt(key, this.clientForm.controls['gulfcamAccountNumber'].value.toString())
    this.client2.rccm = this.clientForm.controls['rccm'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['rccm'].value.toString()) : ''
    this.client2.niu = this.clientForm.controls['niu'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['niu'].value.toString()) : ''
    this.client2.typeClient = aesUtil.encrypt(key, this.clientForm.controls['typeClient'].value.toString())
    // console.log(this.client2)
    // this.client.phone = this.clientForm.controls['phone'].value.e164Number
    this.appState$ = this.clientService.addClient$(this.client2)
      .pipe(
        map((response) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value, content: [JSON.parse(aesUtil.decrypt(key,response.key.toString())), ...this.dataSubjects.value.content]}
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
    this.router.navigate(['/clients/', aesUtil.encrypt(key, client.internalReference.toString())])
  }

  updateClientModal(mymodal: TemplateRef<any>, client: Client) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.client = client
    this.clientType = client.typeClient.name
    this.modalTitle = 'Modifier client'
  }

  updateClient() {
    this.isLoading.next(true)
    this.client2.completeName = aesUtil.encrypt(key, this.clientForm.controls['completeName'].value.toString())
    this.client2.companyName = this.clientForm.controls['companyName'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['companyName'].value.toString()) : ''
    this.client2.email = this.clientForm.controls['email'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['email'].value.toString()) : ''
    this.client2.phone = aesUtil.encrypt(key, this.clientForm.controls['phone'].value.toString())
    this.client2.address = aesUtil.encrypt(key, this.clientForm.controls['address'].value.toString())
    this.client2.gulfcamAccountNumber = aesUtil.encrypt(key, this.clientForm.controls['gulfcamAccountNumber'].value.toString())
    this.client2.rccm = this.clientForm.controls['rccm'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['rccm'].value.toString()) : ''
    this.client2.niu = this.clientForm.controls['niu'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['niu'].value.toString()) : ''
    this.client2.typeClient = aesUtil.encrypt(key, this.clientForm.controls['typeClient'].value.toString())
    this.appState$ = this.clientService.updateClient$(this.client2, aesUtil.encrypt(key, this.client.internalReference.toString()) as number)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === JSON.parse(aesUtil.decrypt(key,response.key.toString())).internalReference)
          this.dataSubjects.value.content[index] = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
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
        map((response) => {
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

  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter) {
      this.dateFilter = '';
      this.companyNameFilter = '';
      this.typeFilter = '';
      this.clientNameFilter = '';
      this.filterClients()
    }
  }


  filterClients() {
    this.page = 1
    this.appState$ = this.clientService.filterClient$(this.companyNameFilter, this.typeFilter, this.clientNameFilter, this.dateFilter, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          // this.notifsService.onSuccess('Chargement des commandes')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }
  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }
}
