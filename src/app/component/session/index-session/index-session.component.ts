import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Router} from "@angular/router";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {SessionService} from "../../../_services/session/session.service";
import {DataState} from "../../../_enum/data.state.enum";
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
import {Session} from "../../../_model/session";
=======
import {aesUtil, key} from "../../../_helpers/aes.js";
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts

@Component({
  selector: 'app-index-session',
  templateUrl: './index-session.component.html',
  styleUrls: ['./index-session.component.css']
})
export class IndexSessionComponent implements OnInit {

<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
  session: Session = new Session();
  sessionForm: FormGroup;
  appState$: Observable<AppState<CustomResponse<Session>>>;
=======
  clients: Client[] = [];
  client: Client = new Client();
  client2: Client = new Client();
  clientType: string;
  clientForm: FormGroup;
  appState$: Observable<AppState<CustomResponse<Client>>>;
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Session>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  page: number = 1;
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
  size: number = 10;
  roleUser = localStorage.getItem('userAccount').toString()
  modalTitle = 'Enregistrer nouvelle session'


  @ViewChild('mymodal', {static: false}) viewMe?: ElementRef<HTMLElement>;
=======
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
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts

  constructor(private fb: FormBuilder, private modalService: NgbModal, private sessionService: SessionService, private router: Router,
              private notifService: NotifsService) {
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
    this.formSession();
=======
    this.formClient();
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
  }

  ngOnInit(): void {
    this.getSessions()
  }

  getSessions() {
    this.appState$ = this.sessionService.sessions$(this.page - 1, this.size)
      .pipe(
        map(response => {
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
          console.log(response)
          this.dataSubjects.next(response)
          this.notifService.onSuccess('chargement des sessions')
          return {dataState: DataState.LOADED_STATE, appData: response}
=======
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Client>)
          this.notifService.onSuccess('chargement des clients')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<Client>}
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number) {
    this.page = event
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
    this.appState$ = this.sessionService.sessions$(this.page - 1, this.size)
=======
    this.appState$ = this.clientService.filterClient$(this.companyNameFilter, this.typeFilter, this.clientNameFilter, this.dateFilter, this.page - 1, this.size)
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
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

<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
  formSession() {
    this.sessionForm = this.fb.group({
      mangwa: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
      tax: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
=======
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
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
    });
  }

  saveSession() {
    this.isLoading.next(true)
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
    this.session = this.sessionForm.value
    this.session.creator = localStorage.getItem('firstName').toString()
    this.appState$ = this.sessionService.addSession$(this.session)
=======
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
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
      .pipe(
        map((response) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value, content: [JSON.parse(aesUtil.decrypt(key,response.key.toString())), ...this.dataSubjects.value.content]}
          )
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("Nouvelle session créée!")
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
    this.formSession();
    // this.sessionForm.reset()
    this.modalService.dismissAll()
    this.modalTitle = 'Enregistrer nouvelle session'
  }

  open(content: any) {
    this.annuler()
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.modalTitle = 'Enregistrer nouvelle session'
  }

  deleteSession(session: Session) {

    Swal.fire({
      title: 'Supprimer session',
      html: "Voulez-vous vraiment supprimer la session de " + session.name.bold() + " ?",
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
        this.deleteSessions(session.name)
      }
    })

  }

<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
  updateSessionModal(mymodal: TemplateRef<any>, session: Session) {
=======
  detailsClient(client: Client) {
    let rout = aesUtil.encrypt(key, client.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, client.internalReference.toString())
    }
    this.router.navigate(['/clients/', rout])
  }

  updateClientModal(mymodal: TemplateRef<any>, client: Client) {
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.modalTitle = 'Modifier session'
    this.session = session
  }

  updateSession() {
    this.isLoading.next(true)
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
    let name = this.session.name
    this.session = this.sessionForm.value
    this.session.creator = localStorage.getItem('firstName').toString()
    this.appState$ = this.sessionService.updateSession$(this.session, name)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(session => session.id === response.id)
          this.dataSubjects.value.content[index] = response
=======
    this.client2.completeName = aesUtil.encrypt(key, this.clientForm.controls['completeName'].value.toString())
    this.client2.companyName = this.clientForm.controls['companyName'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['companyName'].value.toString()) : ''
    this.client2.email = this.clientForm.controls['email'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['email'].value.toString()) : ''
    this.client2.phone = aesUtil.encrypt(key, this.clientForm.controls['phone'].value.toString())
    this.client2.address = aesUtil.encrypt(key, this.clientForm.controls['address'].value.toString())
    this.client2.gulfcamAccountNumber = aesUtil.encrypt(key, this.clientForm.controls['gulfcamAccountNumber'].value.toString())
    this.client2.rccm = this.clientForm.controls['rccm'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['rccm'].value.toString()) : ''
    this.client2.niu = this.clientForm.controls['niu'].value != '' ? aesUtil.encrypt(key, this.clientForm.controls['niu'].value.toString()) : ''
    this.client2.typeClient = aesUtil.encrypt(key, this.clientForm.controls['typeClient'].value.toString())
    let rout = aesUtil.encrypt(key, this.client.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, this.client.internalReference.toString())
    }
    this.appState$ = this.clientService.updateClient$(this.client2, rout as number)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === JSON.parse(aesUtil.decrypt(key,response.key.toString())).internalReference)
          this.dataSubjects.value.content[index] = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
          this.isLoading.next(false)
          this.notifService.onSuccess("Session modifiée avec succès!")
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

  deleteSessions(name: string) {
    this.isLoading.next(true)
    this.appState$ = this.sessionService.deleteSession$(name)
      .pipe(
<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
        map(response  => {
          const index = this.dataSubjects.value.content.findIndex(session => session.name === name)
          this.dataSubjects.value.content[index] = response
=======
        map((response) => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === internalRef)
          this.dataSubjects.value.content.splice(index, 1)
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
          this.isLoading.next(false)
          this.notifService.onSuccess("session terminée avec succès!")
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

<<<<<<< HEAD:src/app/component/session/index-session/index-session.component.ts
=======
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
>>>>>>> 37d14d372724acd031f893c0236343c371360e75:src/app/component/client/index-client/index-client.component.ts
}
