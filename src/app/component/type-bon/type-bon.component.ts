import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VoucherService} from "../../_services/voucher/voucher.service";
import {TypeVoucher} from "../../_model/typeVoucher";
import {BehaviorSubject, Observable, of} from "rxjs";
import {NotifsService} from "../../_services/notifications/notifs.service";
import {StoreHouse} from "../../_model/storehouse";
import Swal from "sweetalert2";
import {StatusService} from "../../_services/status/status.service";
import {aesUtil, key} from "../../_helpers/aes.js";
import {catchError, map, startWith} from "rxjs/operators";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Store} from "../../_model/store";
import {AppState} from "../../_interfaces/app-state";
import {DataState} from "../../_enum/data.state.enum";

@Component({
  selector: 'app-type-bon',
  templateUrl: './type-bon.component.html',
  styleUrls: ['./type-bon.component.css']
})
export class TypeBonComponent implements OnInit {

  voucherForm: FormGroup;
  vouchers: TypeVoucher[] = [];
  voucher: TypeVoucher = new TypeVoucher();
  voucher2: TypeVoucher = new TypeVoucher();
  modalTitle: string = 'Enregistrer nouveau bon';
  role: string[] = []
  appState$: Observable<AppState<CustomResponse<TypeVoucher>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<TypeVoucher>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  page: number = 1;
  size: number = 10;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private voucherService: VoucherService,
              private statusService: StatusService, private notifService: NotifsService) {
    this.formVoucherType();
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
    this.isLoading.next(true);
    this.voucher2.designation = aesUtil.encrypt(key, this.voucherForm.controls['designation'].value.toString())
    this.voucher2.amount = aesUtil.encrypt(key, this.voucherForm.controls['amount'].value.toString())
    this.appState$ = this.voucherService.addVoucher$(this.voucher2)
      .pipe(
        map((response) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value, content: [JSON.parse(aesUtil.decrypt(key,response.key.toString())), ...this.dataSubjects.value.content]}
          )
          this.annuler()
          this.isLoading.next(false)
          this.notifService.onSuccess("Type de bon créé!")
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getVouchers(){
    this.appState$ = this.voucherService.voucher$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<TypeVoucher>)
          this.notifService.onSuccess('chargement des types de coupons')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<TypeVoucher>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
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
    this.voucher2.designation = aesUtil.encrypt(key, this.voucherForm.controls['designation'].value.toString())
    this.voucher2.amount = aesUtil.encrypt(key, this.voucherForm.controls['amount'].value.toString())
    let rout = aesUtil.encrypt(key, this.voucher.internalReference.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, this.voucher.internalReference.toString())
    }
    this.appState$ = this.voucherService.updateVoucher$(this.voucher2, rout as number)
      .pipe(
        map(response => {
          const index = this.dataSubjects.value.content.findIndex(tv => tv.internalReference === JSON.parse(aesUtil.decrypt(key,response.key.toString())).internalReference)
          this.dataSubjects.value.content[index] = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
          this.isLoading.next(false)
          this.notifService.onSuccess("type de bon modifié avec succès!")
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

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  pageChange(event: number) {
    this.page = event
    this.appState$ = this.voucherService.voucher$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<TypeVoucher>)
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString())) as CustomResponse<TypeVoucher>}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  formatNumber(amount: any): string{
    return parseInt(amount).toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }
}
