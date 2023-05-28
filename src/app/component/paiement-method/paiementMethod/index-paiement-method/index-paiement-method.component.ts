import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StoreService} from "../../../../_services/store/store.service";
import {Store} from "../../../../_model/store";
import {PaiementMethod} from "../../../../_model/paiement";
import {PaiementService} from "../../../../_services/paiement/paiement.service";
import {NotifsService} from "../../../../_services/notifications/notifs.service";
import {BehaviorSubject} from "rxjs";
import Swal from "sweetalert2";
import {aesUtil, key} from "../../../../_helpers/aes.js";

@Component({
  selector: 'app-index-paiement-method',
  templateUrl: './index-paiement-method.component.html',
  styleUrls: ['./index-paiement-method.component.css']
})
export class IndexPaiementMethodComponent implements OnInit {

  buyForm: FormGroup;
  paiementMethods: PaiementMethod[] = [];
  paiementMethod: PaiementMethod = new PaiementMethod();
  paiementMethod2: PaiementMethod = new PaiementMethod();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer mode de paiement';
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  constructor(private modalService: NgbModal, private fb: FormBuilder, private paiementService: PaiementService, private notifServices: NotifsService) {
    this.formPaiement()
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getPaiements();
  }

  //initialisation du formulaire de création type de bon
  formPaiement(){
    this.buyForm = this.fb.group({
      designation: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  createPaiementMethod(){
    // console.log(this.storeForm.value)
    this.isLoading.next(true);
    this.paiementMethod.designation = aesUtil.encrypt(key, this.buyForm.controls['designation'].value.toString()) as string
    this.paiementService.createPaymentMethod(this.paiementMethod).subscribe(
      resp => {
        // console.log(resp)
        this.paiementMethods.push( JSON.parse(aesUtil.decrypt(key,resp.key.toString())))
        this.isLoading.next(false);
        this.notifServices.onSuccess("nouvelle méthode de paiement créée")
        this.annuler()
      },
      error => {
        this.notifServices.onError(error.error.message,"échec de création")
        this.isLoading.next(false);
      }
    )
  }
  annuler() {
    this.formPaiement();
    this.modalService.dismissAll()
    this.paiementMethod = new PaiementMethod()
    this.modalTitle = 'Enregistrer mode de paiement';
  }
  getPaiements(){
    this.isLoading.next(true);
    this.paiementService.getPaymentMethods().subscribe(
      response => {
        this.paiementMethods = JSON.parse(aesUtil.decrypt(key,response.key.toString())).content
        this.isLoading.next(false);
        this.notifServices.onSuccess('liste des modes de paiement')
      },
      error => {
        this.notifServices.onError(error.error.message, '')
        this.isLoading.next(false);
      }
    )
  }

  //ouverture du modal
  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
  }

  delete(payment: PaiementMethod, index:number) {
    this.isLoading.next(true);
    this.paiementService.deletePaymentMethod(payment.internalReference).subscribe(
      resp => {
        this.paiementMethods.splice(index, 1)
        this.isLoading.next(false);
        this.notifServices.onSuccess("méthode de paiement supprimée")
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  deletePayment(payment: PaiementMethod, index: number) {
    Swal.fire({
      title: 'Supprimer Méthode de paiement',
      html: "Voulez-vous vraiment supprimer la méthode par "+ payment.designation.toString().bold() + " ?",
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
        this.delete(payment, index)
      }
    })
  }

  updatePaymentModal(mymodal: TemplateRef<any>, payment: PaiementMethod) {
    this.modalService.open(mymodal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    this.paiementMethod = payment
    this.modalTitle = 'Modifier mode de paiement'
  }

  updatePayment() {
    this.isLoading.next(true);
    this.paiementMethod2.designation = aesUtil.encrypt(key, this.buyForm.controls['designation'].value.toString()) as string
    this.paiementService.updatePaiementMethod(this.paiementMethod2, aesUtil.encrypt(key, this.paiementMethod.internalReference.toString()) as number).subscribe(
      resp => {
        this.isLoading.next(false);
        const index = this.paiementMethods.findIndex(pm => pm.internalReference ===  JSON.parse(aesUtil.decrypt(key,resp.key.toString())).internalReference);
        this.paiementMethods[ index ] =  JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
        this.notifServices.onSuccess("mode de paiement modifié avec succès!")
        this.modalTitle = 'Enregistrer mode de paiement'
        this.annuler()
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }
}
