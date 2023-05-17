import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../../_services/order/order.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../../../_services/users/users.service";
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {StoreService} from "../../../_services/store/store.service";
import {Store} from "../../../_model/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IToken} from "../../../_model/token";
import {BehaviorSubject} from "rxjs";
import {StatusAccountService} from "../../../_services/status/status-account.service";
import {StatusUserService} from "../../../_services/status/status-user.service";
import {RoleUserService} from "../../../_services/role/role-user.service";
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css']
})
export class DetailsUserComponent implements OnInit {

  user: ISignup = new ISignup();
  store: Store = new Store();
  typeAccount: string = '';
  statusUser: string = '';
  updateUser: FormGroup ;
  credentials: ICredentialsSignup = new ICredentialsSignup()
  activeUser: boolean
  errorMessage = '';
  stores: Store[] = [];
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  role: string[] = []
  constructor(private userService: UsersService,  private notifsService: NotifsService, private route: ActivatedRoute,
              private storeService: StoreService, private fb: FormBuilder, private statusAccountService: StatusAccountService,
              private statusUserService: StatusUserService, private roleUserService: RoleUserService) {
    this.updateUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[2,6][0-9]{8}'), Validators.minLength(9), Validators.maxLength(9) ]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      idStore: ['', [Validators.required]],
      typeAccount: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      position: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.form = this.updateUser.controls;
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

  ngOnInit(): void {
    this.getUser()
    this.getStores()
  }

  getStores(){
    this.storeService.getStore().subscribe(
      resp => {
        console.log(resp)
        this.stores = resp.content
      },
      error => {

      }
    )
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getUser(id).subscribe(
      resp => {
        console.log(JSON.parse(aesUtil.decrypt(key,resp.key.toString())))
        this.user = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))
        this.typeAccount = this.user.typeAccount.name
        this.statusUser = this.user.status.name

        this.storeService.getStoreByInternalref(aesUtil.encrypt(key, this.user.idStore.toString())).subscribe(
          resp => {
            this.store = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))
          }
        )
      },
      err => {
        this.notifsService.onError(err.error.message, 'échec chargement de l\'utilisateur')
      }
    )

  }

  enableDesable(){
    this.activeUser = this.user.status.name != 'USER_ENABLED'
    this.isLoading.next(true);
    const id = this.route.snapshot.paramMap.get('id')
    this.userService.enableDesable(id.toString(), this.activeUser).subscribe(
      resp => {
        this.isLoading.next(false);
        this.notifsService.onSuccess(resp.message)
        this.getUser()
      }
    )
  }

  onSubmit() {
    this.isLoading.next(true);
    this.credentials = this.updateUser.value;
    const store = this.stores.filter(store => store.localization === this.updateUser.controls['idStore'].value)
    // for (let st of store){
    this.credentials.idStore = store[0].internalReference.toString();
    // }

    this.userService.updateUser(this.credentials).subscribe(
      resp => {
        console.log(resp)
        this.isLoading.next(false);
        this.notifsService.onSuccess('utilisateur modifié')
      },
      error => {
        this.isLoading.next(false)
        this.errorMessage = error.error.message;
      }
    )
  }

  getStatusAccount(status: string): string {
    return this.statusAccountService.allStatus(status)
  }

  getStatus(status: string): string {
    return this.statusUserService.allStatus(status)
  }

  getRole(status: string): string {
    return this.roleUserService.allRole(status)
  }

}
