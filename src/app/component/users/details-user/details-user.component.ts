import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../../_services/order/order.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../../_services/users/users.service";
import {ICredentialsSignup, IRole, ISignup} from "../../../_model/signup";
import {StoreService} from "../../../_services/store/store.service";
import {Store} from "../../../_model/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IToken} from "../../../_model/token";
import {BehaviorSubject, Observable, of} from "rxjs";
import {StatusAccountService} from "../../../_services/status/status-account.service";
import {StatusUserService} from "../../../_services/status/status-user.service";
import {RoleUserService} from "../../../_services/role/role-user.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {Location} from "@angular/common";
import {catchError, map, startWith} from "rxjs/operators";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css']
})
export class DetailsUserComponent implements OnInit {

  user: ISignup = new ISignup();
  store: Store = new Store();
  typeAccount: string = '';
  typeRol: string = '';
  statusUser: string = '';
  updateUser: FormGroup ;
  credentials: ICredentialsSignup = new ICredentialsSignup()
  activeUser: boolean
  errorMessage = '';
  stores: Store[] = [];
  form: any;
  appState$: Observable<AppState<ISignup>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<ISignup>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  role: string[] = []
  accounts = [
    {name : "Attaché Commercial" , value : "COMMERCIAL_ATTACHE"},
    {name : "Caissier/Trésorier" , value : "TREASURY"},
    {name : "Comptable" , value : "COMPTABLE"},
    {name : "Directeur Commercial" , value : "SALES_MANAGER"},
    {name : "DSI/AUDIT" , value : "DSI_AUDIT"},
    {name : "Gestionnaire espace 1" , value : "MANAGER_SPACES_1"},
    {name : "Gestionnaire espace 2" , value : "MANAGER_SPACES_2"},
    {name : "Gestionnaire de station" , value : "MANAGER_STATION"},
  ]
  roles = [
    {name : "Administrateur" , value : "ROLE_ADMIN"},
    {name : "Simple Utilisateur" , value : "ROLE_USER"},
    {name : "Super Administrateur" , value : "ROLE_SUPERADMIN"}
  ]
  constructor(private userService: UsersService,  private notifsService: NotifsService, private route: ActivatedRoute, private router: Router,
              private storeService: StoreService, private fb: FormBuilder, private statusAccountService: StatusAccountService,
              private statusUserService: StatusUserService, private roleUserService: RoleUserService, private _location: Location) {
    this.updateUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[2,6][0-9]{8}'), Validators.minLength(9), Validators.maxLength(9) ]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      idStore: ['', [Validators.required]],
      typeAccount: ['', [Validators.required, Validators.minLength(4)]],
      // password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      position: ['', [Validators.required, Validators.minLength(4)]],
      roleName: ['', ]
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
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
      },
      error => {

      }
    )
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');

    // this.userService.getUser(id).subscribe(
    //   resp => {
    //     // console.log(JSON.parse(aesUtil.decrypt(key,resp.key.toString())))
    //     this.user = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))
    //     this.typeAccount = this.user.typeAccount.name
    //     this.typeRol = this.user.roles[0].name
    //     this.statusUser = this.user.status.name
    //
    //   },
    //   err => {
    //     this.notifsService.onError(err.error.message, 'échec chargement de l\'utilisateur')
    //   }
    // )

    this.appState$ = this.userService.user$(id)
      .pipe(
        map(response => {
          this.user = JSON.parse(aesUtil.decrypt(key,response.key.toString()))
          this.statusUser = this.user.status.name
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
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

      // this.credentials.internalReference = aesUtil.encrypt(key, this.user.internalReference.toString());
      this.credentials.email = aesUtil.encrypt(key, this.updateUser.controls['email'].value.toString());
      this.credentials.typeAccount = aesUtil.encrypt(key, this.updateUser.controls['typeAccount'].value.toString());
      this.credentials.telephone = aesUtil.encrypt(key, this.updateUser.controls['telephone'].value.toString());
      this.credentials.firstName = aesUtil.encrypt(key, this.updateUser.controls['firstName'].value.toString());
      this.credentials.lastName = aesUtil.encrypt(key, this.updateUser.controls['lastName'].value.toString());
      this.credentials.roleName = aesUtil.encrypt(key, this.updateUser.controls['roleName'].value);
      this.credentials.password = aesUtil.encrypt(key, 'null');
      this.credentials.pinCode = aesUtil.encrypt(key, this.updateUser.controls['pinCode'].value.toString());
      this.credentials.position = aesUtil.encrypt(key, this.updateUser.controls['position'].value.toString());
      // on recherche l'id du magasin dans la liste des magasins

      const store = this.updateUser.controls['idStore'].value
      this.credentials.idStore = aesUtil.encrypt(key, store.toString());
      // this.credentials.idStore = aesUtil.encrypt(key, '123456789');

    const id = this.route.snapshot.paramMap.get('id');
      this.userService.updateUser(this.credentials, id).subscribe(
        resp => {
          this.isLoading.next(false);
          this.getUser()
          this.notifsService.onSuccess('utilisateur modifié')
          this.router.navigate(['users'])
        },
        error => {
          this.isLoading.next(false)
          // this.errorMessage = error.error.message;
          // console.log("voici l'erreur ", error.error.message)
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

  back() {
    this._location.back()
  }

}
