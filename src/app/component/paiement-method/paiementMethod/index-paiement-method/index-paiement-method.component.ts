import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StoreService} from "../../../../_services/store/store.service";
import {Store} from "../../../../_model/store";
import {PaiementMethod} from "../../../../_model/paiement";
import {PaiementService} from "../../../../_services/paiement/paiement.service";
import {NotifsService} from "../../../../_services/notifications/notifs.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import Swal from "sweetalert2";
import {aesUtil, key} from "../../../../_helpers/aes.js";
import {AppState} from "../../../../_interfaces/app-state";
import {CustomResponse} from "../../../../_interfaces/custom-response";
import {DataState} from "../../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";

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
  appState$: Observable<AppState<CustomResponse<PaiementMethod>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<PaiementMethod>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  modalTitle = 'Enregistrer mode de paiement';
  page: number = 1;
  size: number = 10;
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []

  constructor(private modalService: NgbModal, private fb: FormBuilder, private paiementService: PaiementService, private notifServices: NotifsService) {
    this.formPaiement()
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key, authority));
    });
  }

  ngOnInit(): void {
    this.getPaiements();
  }

  //initialisation du formulaire de création type de bon
  formPaiement() {
    this.buyForm = this.fb.group({
      designation: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  createPaiementMethod() {
    this.isLoading.next(true)
    this.paiementMethod2.designation = aesUtil.encrypt(key, this.buyForm.controls['designation'].value.toString()) as string
    this.appState$ = this.paiementService.addPayment$(this.paiementMethod2)
      .pipe(
        map((response) => {
          this.dataSubjects.next(
            {
              ...this.dataSubjects.value,
              content: [JSON.parse(aesUtil.decrypt(key, response.key.toString())), ...this.dataSubjects.value.content]
            }
          )
          this.annuler()
          this.isLoading.next(false)
          this.notifServices.onSuccess("nouveau moyen de paiement ajouté!")
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
    this.formPaiement();
    this.modalService.dismissAll()
    this.paiementMethod = new PaiementMethod()
    this.modalTitle = 'Enregistrer mode de paiement';
  }

  getPaiements() {
    this.appState$ = this.paiementService.payment$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<PaiementMethod>)
          this.notifServices.onSuccess('Chargement des moyens de paiement')
          return {
            dataState: DataState.LOADED_STATE,
            appData: JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<PaiementMethod>
          }
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  //ouverture du modal
  open(content: any) {
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
  }

  delete(payment: PaiementMethod, index: number) {
    // this.isLoading.next(true);
    // this.paiementService.deletePaymentMethod(payment.internalReference).subscribe(
    //   resp => {
    //     this.paiementMethods.splice(index, 1)
    //     this.isLoading.next(false);
    //     this.notifServices.onSuccess("méthode de paiement supprimée")
    //     this.annuler()
    //   },
    //   error => {
    //     this.isLoading.next(false);
    //   }
    // )
  }

  deletePayment(payment: PaiementMethod, index: number) {
    Swal.fire({
      title: 'Supprimer Méthode de paiement',
      html: "Voulez-vous vraiment supprimer la méthode par " + payment.designation.toString().bold() + " ?",
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
    let rout = aesUtil.encrypt(key, this.paiementMethod.internalReference.toString())
    while (rout.includes('/')) {
      rout = aesUtil.encrypt(key, this.paiementMethod.internalReference.toString())
    }
    this.appState$ = this.paiementService.updatePayment$(this.paiementMethod2, rout as number)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(client => client.internalReference === JSON.parse(aesUtil.decrypt(key, response.key.toString())).internalReference)
          this.dataSubjects.value.content[index] = JSON.parse(aesUtil.decrypt(key, response.key.toString()))
          this.isLoading.next(false)
          this.notifServices.onSuccess("mode de paiement modifié avec succès!")
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

  pageChange(event: number) {
    this.page = event
    this.appState$ = this.paiementService.payment$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<PaiementMethod>)
          return {
            dataState: DataState.LOADED_STATE,
            appData: JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<PaiementMethod>
          }
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }
}
