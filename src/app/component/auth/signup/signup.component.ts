import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICredentials} from "../../../_interfaces/credentials";
import {IToken} from "../../../_model/token";
import {AuthService} from "../../../_services/auth.service";
import {TokenService} from "../../../_services/token/token.service";
import {ICredentialsSignup} from "../../../_model/signup";
import {BehaviorSubject, Observable, of} from "rxjs";
import {DataState} from "../../../_enum/data.state.enum";
import {AppState} from "../../../_interfaces/app-state";
import {catchError, map, startWith} from "rxjs/operators";
import {Router} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {Store} from "../../../_model/store";

@Component({
  selector: 'app-logout',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  project = 'Gulfcam';
  socity = 'Gulfcam';
  signup: FormGroup ;
  credentials: ICredentialsSignup = new ICredentialsSignup()
  user?: IToken;
  errorMessage = '';
  stores: Store[] = [];
  findStore: Store;

  // appState$: Observable<AppState<CustomResponseSignup>> = new Observable<AppState<CustomResponseSignup>>();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  readonly DataState = DataState;
  // private dataSubject = new BehaviorSubject<CustomResponseSignup>(null);
  form: any;
  constructor(
    private fb: FormBuilder, private authService: AuthService, private router: Router, private storeService: StoreService) {
    this.signup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[2,6][0-9]{8}'), Validators.minLength(9), Validators.maxLength(9) ]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      idStore: ['', [Validators.required]],
      // username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]],
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      position: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.form = this.signup.controls;
    this.findStore = new Store()
  }

  ngOnInit(): void {
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


  onSubmit() {
    this.isLoading.next(true);
    this.credentials = this.signup.value;
    // on recherche l'id du magasin dans la liste des magasins
    const store = this.stores.filter(store => store.localization === this.signup.controls['idStore'].value)
    this.credentials.idStore = store[0].internalReference.toString();

    this.authService.signup(this.credentials).subscribe(
      resp => {
        this.isLoading.next(false);
        this.router.navigate(['auth'])
      },
      error => {
        this.isLoading.next(false)
        this.errorMessage = error.error.message;
        // console.log("voici l'erreur ", error.error.message)
      }
    )
    // this.appState$ = this.authService.signup$(this.credentials)
    //   .pipe(
    //     map((response) => {
    //       console.log('la reponse', response)
    //       this.dataSubject.next(
    //         {
    //           ...response, data: { signups: [response.data.signup, ...this.dataSubject.value.data.signups]}
    //         }
    //       );
    //       this.isLoading.next(false);
    //       return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value};
    //     },
    //       (error) => {
    //         console.log('falseee ', error.error.message)
    //       }
    //       ),
    //     // source => {
    //     //   console.log(source.)
    //     // },
    //     startWith({dataState: DataState.LOADING_STATE, appData: null}),
    //     catchError((error => {
    //       // this.notificationService.onError(error);
    //
    //       this.isLoading.next(false);
    //       return of({dataState: DataState.ERROR_STATE, error: error});
    //     }))
    //   );
  }

}
