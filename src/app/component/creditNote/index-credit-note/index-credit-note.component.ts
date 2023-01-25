import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../../_model/store";
import {IUser} from "../../../_model/user";
import {RequestOpposition} from "../../../_model/requestOpposition";
import {Unite} from "../../../_model/unite";
import {TypeVoucher} from "../../../_model/typeVoucher";
import {Client} from "../../../_model/client";
import {BehaviorSubject, of} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreService} from "../../../_services/store/store.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UnitsService} from "../../../_services/units/units.service";
import {VoucherService} from "../../../_services/voucher/voucher.service";
import {ClientService} from "../../../_services/clients/client.service";
import {UsersService} from "../../../_services/users/users.service";
import {OppositionService} from "../../../_services/opposition/opposition.service";
import Swal from "sweetalert2";
import {StationService} from "../../../_services/stations/station.service";
import {Station} from "../../../_model/station";
import {CreditNote} from "../../../_model/creditNote";
import {CreditNoteService} from "../../../_services/creditNote/credit-note.service";
import {StatusService} from "../../../_services/status/status.service";
import {CouponService} from "../../../_services/coupons/coupon.service";
import {catchError, map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-index-credit-note',
  templateUrl: './index-credit-note.component.html',
  styleUrls: ['./index-credit-note.component.css']
})
export class IndexCreditNoteComponent implements OnInit {

  creditForm: FormGroup;
  stores: Store[] = [];
  users: IUser[] = [];
  store: Store = new Store ();
  creditNote: CreditNote = new CreditNote();
  creditNotes: CreditNote[] = [];
  unit: Unite = new Unite();
  typeVouchers: TypeVoucher[]
  clients: Client[]
  stations: Station[]
  vouchers: number[] = []
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouvelle note de credit';
  roleUser = localStorage.getItem('userAccount').toString()
  role: string[] = []
  page = 1;
  size = 20;
  totalElements: number = 0;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private storeService: StoreService, private router: Router,
              private notifService: NotifsService, private unitService: UnitsService, private voucherService: VoucherService,
              private clientService: ClientService, private userService: UsersService, private creditNoteService: CreditNoteService,
              private stationService: StationService, private statusService: StatusService, private couponService: CouponService) {
    this.formStore();
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
  }

  ngOnInit(): void {
    this.getCreditNote();
    this.getStations()
  }

  //initialisation du formulaire de création type de bon
  formStore(){
    this.creditForm = this.fb.group({
      idStation: ['', [Validators.required,]],
      serialNumber: ['', [Validators.required, Validators.pattern('^[0-9]*'),]],
    });
  }

  //ouverture du modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  createCreditNote(){
    console.log(this.creditForm.value)
    // this.creditNote.idClient = this.clients.find(client => client.completeName === this.creditForm.controls['idClient'].value).internalReference
    this.creditNote.idStation = parseInt(this.creditForm.controls['idStation'].value)
    this.creditNote.serialCoupons = this.vouchers
    this.isLoading.next(true);
    this.creditNoteService.saveCreditNote(this.creditNote).subscribe(
      resp => {
        this.getCreditNote()
        // this.creditNotes.push(resp)
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

  getCreditNote(){
    this.creditNoteService.getCreditNote(this.page - 1, this.size).subscribe(
      resp => {
        this.creditNotes = resp.content
        this.totalElements = resp.totalElements
      },
    )
  }

  pageChange(event: number) {
    this.page = event
    this.creditNoteService.getCreditNote(this.page - 1, this.size).subscribe(
      resp => {
        this.creditNotes = resp.content
      },
    )
  }

  getStations(){
    this.stationService.getStations().subscribe(
      resp => {
        this.stations = resp.content
      },
    )
  }

  annuler() {
    this.formStore();
    this.store = new Store()
    this.modalService.dismissAll()
    this.vouchers = []
  }

  delete(store: CreditNote, index:number) {
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
    this.creditNoteService.validCreditNote(internalRef).subscribe(
      resp => {
        console.log(resp)
        const index = this.creditNotes.findIndex(req => req.internalReference === resp.internalReference);
        this.creditNotes[ index ] = resp;
        this.isLoading.next(false);
        this.notifService.onSuccess("note de crédit validée")
      },
      error => {
        // this.notifServices.onError(error.error.message,"échec de suppression")
        this.isLoading.next(false);
      }
    )
  }

  deleteStore(store: CreditNote, index: number) {
    Swal.fire({
      title: 'Supprimer Magasin',
      html: "Voulez-vous vraiment supprimer la note "+ store.internalReference.toString().bold() + " ?",
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

  updateStoreModal(mymodal: TemplateRef<any>, store: CreditNote) {
    console.log(store)
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    this.creditNote = store
    for (let coupon of store.coupon){
      this.vouchers.push(parseInt(coupon.serialNumber))
    }
    this.modalTitle = 'Modifier note'
  }

  updateRequest() {
    this.isLoading.next(true);
    console.log(this.creditForm.controls['localization'].value)
    // this.storeService.updateStore(this.creditForm.value, this.store.internalReference).subscribe(
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


  addCoupon() {
    let str= parseInt(this.creditForm.controls['serialNumber'].value).toString();
    this.couponService.getCouponsBySerialNumber(str).subscribe(
      res => {
        if (res.status.name === 'USED' ){
          if (res.idCreditNote != null){
            this.notifService.onWarning('Ce coupon a déjà fait l\'objet d\'une note de crédit')
          }else {
            if (res.idStation === parseInt(this.creditForm.controls['idStation'].value)){
              this.vouchers.push(parseInt(this.creditForm.controls['serialNumber'].value))
              this.creditForm.controls['serialNumber'].reset()
            }else {
             this.notifService.onWarning('Ce coupon n\'a pas été utilisé dans cette station')
            }
          }
        }else{
          this.notifService.onWarning("Ce coupon n'a pas encore été utilisé en station")
        }
      }, error => {
        this.notifService.onError("Ce coupon n'existe pas", '')
      }
    )
  }

  removeCoupon(coupon: number) {
    console.log(this.vouchers.indexOf(coupon))
    const prodIndex = this.vouchers.indexOf(coupon)
    this.vouchers.splice(prodIndex, 1)
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  creditNoteDetails(note: CreditNote) {
    this.router.navigate(['/credit-note/details', note.internalReference])
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }
}
