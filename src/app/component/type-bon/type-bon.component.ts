import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VoucherService} from "../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../_model/typeVoucher";
import {BehaviorSubject} from "rxjs";
import {NotifsService} from "../../_services/notifications/notifs.service";
import {StoreHouse} from "../../_model/storehouse";
import Swal from "sweetalert2";
import {StatusService} from "../../_services/status/status.service";
import {aesUtil, key} from "../../_helpers/aes";

@Component({
  selector: 'app-type-bon',
  templateUrl: './type-bon.component.html',
  styleUrls: ['./type-bon.component.css']
})
export class TypeBonComponent implements OnInit {

  voucherForm: FormGroup;
  vouchers: TypeVoucher[] = [];
  voucher: TypeVoucher;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle: string = 'Enregistrer nouveau bon';
  role: string[] = []
  constructor(private modalService: NgbModal, private fb: FormBuilder, private voucherService: VoucherService,
              private statusService: StatusService, private notifService: NotifsService) {
    this.formVoucherType();
    this.voucher = new TypeVoucher()
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }


  ngOnInit(): void {
    this.getVouchers();
  }

  //initialisation du formulaire de création type de bon
  formVoucherType(){
    this.voucherForm = this.fb.group({
      designation: ['', ],
      amount: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
    });
  }

  //ouverture du modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
  }

  createVoucher(){
    console.log(this.voucherForm.value)
    this.isLoading.next(true);
    this.voucher.designation = this.voucherForm.controls['designation'].value
    this.voucher.amount = this.voucherForm.controls['amount'].value
    this.voucherService.createTypevoucher(this.voucher).subscribe(
      resp => {
        console.log(resp)
        this.vouchers.push(resp)
        this.annuler()
        this.isLoading.next(false);
        this.notifService.onSuccess('type de coupon créé')
      },
      error => {
        // this.notifService.onError(error.error.message, '')
        this.isLoading.next(false);
      }
    )
  }

  getVouchers(){
    console.log(this.voucherForm.value)
    this.voucherService.getTypevoucher().subscribe(
      resp => {
        console.log(resp)
        this.vouchers = resp.content
        this.notifService.onSuccess('chargement des types de coupons')
      },
      error => {
        // this.notifService.onError(error.error.message, '')
      }
    )
  }

  annuler() {
    this.formVoucherType();
    this.voucher = new TypeVoucher()
    this.modalService.dismissAll()
    this.modalTitle = 'Enregistrer nouveau bon'
  }

  delete(voucher: TypeVoucher, index: number) {
    this.isLoading.next(true);
    this.voucherService.deleteTypevoucher(voucher.internalReference).subscribe(
      resp => {
        // console.log(resp)
        this.vouchers.splice(index, 1)
        this.isLoading.next(false);
        this.notifService.onSuccess("type de bon de "+voucher.amount+" supprimé")
      },
      error => {
        // this.notifServices.onError(error.error.message,"échec de suppression")
        this.isLoading.next(false);
      }
    )
  }

  deleteTypeVoucher(tVoucher: TypeVoucher, index: number) {
    Swal.fire({
      title: 'Supprimer Type de bon',
      html: "Voulez-vous vraiment supprimer les bons de "+ tVoucher.amount.toString().bold() + " ?",
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
        this.delete(tVoucher, index)
      }
    })
  }

  updateVoucherModal(mymodal: TemplateRef<any>, tVouvher: TypeVoucher) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    this.voucher = tVouvher
    this.modalTitle = 'Modifier type de bon'
  }

  updateTypeVoucher() {
    this.isLoading.next(true);

    this.voucherService.updateTypeVoucher(this.voucherForm.value, this.voucher.internalReference).subscribe(
      resp => {
        this.isLoading.next(false);
        // on recherche l'index du client dont on veut faire la modification dans liste des clients
        const index = this.vouchers.findIndex(tVoucher => tVoucher.internalReference === resp.internalReference);
        this.vouchers[ index ] = resp;
        this.notifService.onSuccess("type de bon modifié avec succès!")
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
}
