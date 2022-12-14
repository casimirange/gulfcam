import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {Unite} from "../../../_model/unite";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {BehaviorSubject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreService} from "../../../_services/store/store.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UnitsService} from "../../../_services/units/units.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import Swal from "sweetalert2";
import {ClientService} from "../../../_services/clients/client.service";
import {Client} from "../../../_model/client";
import {RequestOpposition} from "../../../_model/requestOpposition";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_model/user";
import {OppositionService} from "../../../_services/opposition/opposition.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {StatusService} from "../../../_services/status/status.service";
import {ISignup} from "../../../_model/signup";
import {CouponService} from "../../../_services/coupons/coupon.service";

@Component({
  selector: 'app-index-request-opposition',
  templateUrl: './index-request-opposition.component.html',
  styleUrls: ['./index-request-opposition.component.scss']
})
export class IndexRequestOppositionComponent implements OnInit {

  requestForm: FormGroup;
  stores: Store[] = [];
  users: ISignup[] = [];
  store: Store = new Store ();
  canaux = ['Appel', 'Courier papier', 'Email', 'Sur site']
  requestOpposition: RequestOpposition = new RequestOpposition();
  requestOppositions: RequestOpposition[] = [];
  unit: Unite = new Unite();
  clients: Client[]
  vouchers: number[] = []
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouvelle requ??te';
  roleUser = localStorage.getItem('userAccount').toString()
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService, private router: Router,
              private notifService: NotifsService, private unitService: UnitsService, private voucherService: VoucherService,
              private clientService: ClientService, private userService: UsersService, private requestService: OppositionService,
              private statusService: StatusService, private couponService: CouponService) {
    this.formRequest();
  }

  ngOnInit(): void {
    this.getClients();
    this.getUsers();
    this.getRequests();
  }

  //initialisation du formulaire de cr??ation type de bon
    formRequest(){
    this.requestForm = this.fb.group({
      idClient: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      idManagerCoupon: ['', [Validators.required,]],
      serialNumber: ['', [Validators.required, Validators.pattern('^[0-9]*'),]],
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
    this.requestOpposition.serialCoupons = this.vouchers

    this.isLoading.next(true);
    console.log('demande d\'opposition', this.requestOpposition)
    this.requestService.saveOppositionRequest(this.requestOpposition).subscribe(
      resp => {
        // this.requestOppositions.push(resp)
        this.getRequests()
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('enregistrement effectu??')
      },
      error => {
        this.notifService.onError(error.error.message, '')
        this.isLoading.next(false);
      }
    )
  }

  getRequests(){
    this.requestService.getOppositionRequest(this.page -1, this.size).subscribe(
      resp => {
        this.requestOppositions = resp.content
        // this.size = resp.size
        this.totalPages = resp.totalPages
        this.totalElements = resp.totalElements
        this.notifService.onSuccess('Liste des demandes d\'opposition')
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
        this.users = this.users.filter(user => user.typeAccount.name === 'MANAGER_COUPON')
      },
    )
  }

  annuler() {
    this.formRequest();
    this.store = new Store()
    this.modalService.dismissAll()
    this.vouchers = []
  }

  updateStoreModal(mymodal: TemplateRef<any>, store: RequestOpposition) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    this.requestOpposition = store
    this.modalTitle = 'Modifier requ??te'
  }

  updateRequest() {
    this.isLoading.next(true);
    console.log(this.requestForm.controls['localization'].value)
    // this.storeService.updateStore(this.requestForm.value, this.store.internalReference).subscribe(
    //   resp => {
    //     this.isLoading.next(false);
    //     const index = this.stores.findIndex(store => store.internalReference === resp.internalReference);
    //     this.stores[ index ] = resp;
    //     this.notifService.onSuccess("requ??te modifi??e avec succ??s!")
    //     this.annuler()
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //   }
    // )
  }

  // showDetails(store: Store) {
  //   this.router.navigate(['/entrepots/details', store.internalReference])
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
    this.couponService.getCouponsBySerialNumber(this.requestForm.controls['serialNumber'].value).subscribe(
      res => {
        if (res.status.name === 'ACTIVATED' ){
          this.vouchers.push(this.requestForm.controls['serialNumber'].value)
          this.requestForm.controls['serialNumber'].reset()
        }else{
          this.notifService.onWarning(`Seuls les coupons activ??s peuvent ??tre utilis??s. statut du coupon: ${this.getStatuts(res.status.name)}`)
        }
      }, error => {
        this.notifService.onError("Ce coupon n'existe pas", '')
      }
    )
    console.log(this.vouchers)
  }

  removeCoupon(coupon: number) {
    console.log(this.vouchers.indexOf(coupon))
    const prodIndex = this.vouchers.indexOf(coupon)
    this.vouchers.splice(prodIndex, 1)
    console.log('prod', coupon)
    console.log('produit', this.vouchers)
  }

  requestDetails(request: RequestOpposition) {
    this.router.navigate(['/request-opposition/details', request.internalReference])
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.getRequests()
  }
}
