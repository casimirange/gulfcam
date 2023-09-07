import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICredentialsSignup} from "../../../_model/signup";
import {IToken} from "../../../_model/token";
<<<<<<< HEAD
import {BehaviorSubject, Observable} from "rxjs";
=======
import {Store} from "../../../_model/store";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
import {AppState} from "../../../_interfaces/app-state";
import {AuthService} from "../../../_services/auth.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {Location} from "@angular/common";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {

  signup: FormGroup ;
  credentials: ICredentialsSignup = new ICredentialsSignup()
  user?: IToken;
  errorMessage = '';
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  // readonly DataState = DataState;
  form: any;
  role: string[] = []
  private mySubscription: Subscription;
  load: boolean;
  constructor(
<<<<<<< HEAD
    private fb: FormBuilder, private authService: AuthService, private router: Router,
=======
    private fb: FormBuilder, private authService: AuthService, private router: Router, private storeService: StoreService, private _location: Location,
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
    private notifService: NotifsService) {
    this.signup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[2,6][0-9]{8}'), Validators.minLength(9), Validators.maxLength(9) ]],
      montant: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      // username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]],
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      typeAccount: ['', ],
      roleName: ['', ],
    });

    this.form = this.signup.controls;
<<<<<<< HEAD
=======
    this.findStore = new Store()
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
  }


  ngOnInit(): void {
<<<<<<< HEAD
=======
    this.getStores()
  }

  getStores(){
    this.load = true
    this.mySubscription = this.storeService.getStore().subscribe(
      resp => {
        // console.log(resp)
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.load = false
      },
      error => {

      }
    )
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
  }


  saveUser() {
    this.isLoading.next(true);
    this.credentials = this.signup.value;
<<<<<<< HEAD
    this.credentials.montant = +this.signup.controls["montant"].value
=======
    // console.log('user1', this.credentials)
    this.credentials.email = aesUtil.encrypt(key, this.signup.controls['email'].value);
    this.credentials.typeAccount = aesUtil.encrypt(key, this.signup.controls['typeAccount'].value);
    this.credentials.telephone = aesUtil.encrypt(key, this.signup.controls['telephone'].value);
    this.credentials.firstName = aesUtil.encrypt(key, this.signup.controls['firstName'].value);
    this.credentials.lastName = aesUtil.encrypt(key, this.signup.controls['lastName'].value);
    this.credentials.roleName = aesUtil.encrypt(key, this.signup.controls['roleName'].value);
    this.credentials.password = aesUtil.encrypt(key, this.signup.controls['password'].value);
    this.credentials.pinCode = aesUtil.encrypt(key, this.signup.controls['pinCode'].value);
    this.credentials.position = aesUtil.encrypt(key, this.signup.controls['position'].value);
    // on recherche l'id du magasin dans la liste des magasins
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

    const store = this.stores.find(store => store.localization === this.signup.controls['idStore'].value)
    this.credentials.idStore = aesUtil.encrypt(key, store.internalReference.toString());
    // this.credentials.idStore = aesUtil.encrypt(key, '123456789');
    // console.log('user2', this.credentials)
    this.authService.signup(this.credentials).subscribe(
      resp => {
        this.isLoading.next(false);
        this.notifService.onSuccess('nouvel utilisateur enregistré')
        this.router.navigate(['users'])
      },
      error => {
        this.isLoading.next(false)
        // this.errorMessage = error.error.message;
        // console.log("voici l'erreur ", error.error.message)
      }
    )
  }

  back() {
    this._location.back()
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null
  }
}
