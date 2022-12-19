import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_interfaces/store";
import {Unite} from "../../../_interfaces/unite";
import {TypeVoucher} from "../../../_interfaces/typeVoucher";
import {BehaviorSubject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreService} from "../../../_services/store/store.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UnitsService} from "../../../_services/units/units.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import Swal from "sweetalert2";
import {ClientService} from "../../../_services/clients/client.service";
import {Client} from "../../../_interfaces/client";
import {RequestOpposition} from "../../../_interfaces/requestOpposition";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_interfaces/user";
import {OppositionService} from "../../../_services/opposition/opposition.service";

@Component({
  selector: 'app-index-request-opposition',
  templateUrl: './index-request-opposition.component.html',
  styleUrls: ['./index-request-opposition.component.css']
})
export class IndexRequestOppositionComponent implements OnInit {

  requestForm: FormGroup;
  stores: Store[] = [];
  users: IUser[] = [];
  store: Store = new Store ();
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  requestOpposition: RequestOpposition = new RequestOpposition();
  requestOppositions: RequestOpposition[] = [];
  unit: Unite = new Unite();
  typeVouchers: TypeVoucher[]
  clients: Client[]
  voucher: number[] = []
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouvelle requête';
  roleUser = localStorage.getItem('userAccount').toString()
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService, private router: Router,
              private notifService: NotifsService, private unitService: UnitsService, private voucherService: VoucherService,
              private clientService: ClientService, private userService: UsersService, private requestService: OppositionService) {
    this.formStore();
  }

  ngOnInit(): void {
    this.getClients();
    this.getUsers();
    this.getRequests();
  }

  //initialisation du formulaire de création type de bon
  formStore(){
    this.requestForm = this.fb.group({
      idClient: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      idManagerCoupon: ['', [Validators.required,]],
      serialNumber: ['', ],
      chanel: ['', ],
    });
  }

  //ouverture du modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  createRequest(){
    this.requestOpposition.reason = this.requestForm.controls['reason'].value
    this.requestOpposition.description = this.requestForm.controls['description'].value
    this.requestOpposition.idServiceClient = parseInt(localStorage.getItem('uid'))
    this.requestOpposition.idClient = this.clients.find(client => client.completeName === this.requestForm.controls['idClient'].value).internalReference
    this.requestOpposition.idManagerCoupon = parseInt(this.requestForm.controls['idManagerCoupon'].value)
    this.requestOpposition.serialCoupons = this.voucher

    this.isLoading.next(true);
    console.log('demande d\'opposition', this.requestOpposition)
    this.requestService.saveOppositionRequest(this.requestOpposition).subscribe(
      resp => {
        // this.requestOppositions.push(resp)
        this.getRequests()
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('enregistrement effectué')
      },
      error => {
        this.notifService.onError(error.error.message, '')
        this.isLoading.next(false);
      }
    )
  }

  getRequests(){
    this.requestService.getOppositionRequest().subscribe(
      resp => {
        this.requestOppositions = resp.content
        console.log('request', resp)
      },
    )
  }

  getClients(){
    this.clientService.getAllClients().subscribe(
      resp => {
        this.clients = resp.content
      },
    )
  }

  getUsers(){
    console.log(this.requestForm.value)
    this.userService.getUsers().subscribe(
      resp => {
        this.users = resp.content
      },
    )
  }

  annuler() {
    this.formStore();
    this.store = new Store()
    this.modalService.dismissAll()
  }

  delete(store: RequestOpposition, index:number) {
    // this.isLoading.next(true);
    // this.storeService.deleteStore(store.internalReference).subscribe(
    //   resp => {
    //     // console.log(resp)
    //     this.stores.splice(index, 1)
    //     this.isLoading.next(false);
    //     this.notifService.onSuccess("magasin de "+store.internalReference+" supprimé")
    //   },
    //   error => {
    //     // this.notifServices.onError(error.error.message,"échec de suppression")
    //     this.isLoading.next(false);
    //   }
    // )
  }

  valid(internalRef: number, index:number) {
    this.isLoading.next(true);
    this.requestService.validOppositionRequest(internalRef).subscribe(
      resp => {
        // console.log(resp)
        const index = this.requestOppositions.findIndex(req => req.internalReference === resp.internalReference);
        this.requestOppositions[ index ] = resp;
        this.isLoading.next(false);
        this.notifService.onSuccess("requête d'opposition validée")
      },
    )
  }

  deleteStore(store: RequestOpposition, index: number) {
    Swal.fire({
      title: 'Supprimer Magasin',
      html: "Voulez-vous vraiment supprimer la requête "+ store.internalReference.toString().bold() + " ?",
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
        this.delete(store, index)
      }
    })
  }

  updateStoreModal(mymodal: TemplateRef<any>, store: RequestOpposition) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    this.requestOpposition = store
    this.modalTitle = 'Modifier requête'
  }

  updateRequest() {
    this.isLoading.next(true);
    console.log(this.requestForm.controls['localization'].value)
    // this.storeService.updateStore(this.requestForm.value, this.store.internalReference).subscribe(
    //   resp => {
    //     this.isLoading.next(false);
    //     const index = this.stores.findIndex(store => store.internalReference === resp.internalReference);
    //     this.stores[ index ] = resp;
    //     this.notifService.onSuccess("requête modifiée avec succès!")
    //     this.annuler()
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //   }
    // )
  }

  // showDetails(store: Store) {
  //   this.router.navigate(['/entrepots/details', store.internalReference])
  //   // [routerLink]=""
  // }

  findClients(event: any): void{
    console.log(event)
    this.clientService.searchClient(event) .subscribe(
      resp => {
        this.clients = resp;
        console.log(resp)
      }, error => {
        this.clients = []
      }
    )
  }

  addCoupon() {
    this.voucher.push(this.requestForm.controls['serialNumber'].value)
    this.requestForm.controls['serialNumber'].reset()
    console.log(this.voucher)
  }

  requestDetails(request: RequestOpposition) {
    this.router.navigate(['/request-opposition/details', request.internalReference])
  }
}