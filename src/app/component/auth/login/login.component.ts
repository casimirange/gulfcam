import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../_services/auth.service";
import {TokenService} from "../../../_services/token/token.service";
import {ICredentials} from "../../../_interfaces/credentials";
import {IToken} from "../../../_model/token";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {catchError, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {NotifsService} from "../../../_services/notifications/notifs.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  project = 'Gulfcam';
  socity = 'Gulfcam';
  loginForm: FormGroup ;
  credentials: ICredentials = { }
  user?: IToken;
  errorMessage = '';

  // appState$: Observable<AppState<CustomResponseLogin>> = new Observable<AppState<CustomResponseLogin>>();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  readonly DataState = DataState;
  isLoginFailed: boolean;
  isLoggedIn: boolean;
  form: any;
  constructor(
    private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private tokenService: TokenService,
    private notifsService: NotifsService
    ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]],
    });
    this.form = this.loginForm.controls;
  }

  ngOnInit(): void {
    this.notifsService.apiError.subscribe(
      data => {
        // this.notifsService.onError(data)
        console.log("datas ", data)
      }
    )
  }


  onSubmit() {
    this.isLoading.next(true);
    this.credentials.login = this.loginForm.controls['username'].value;
    this.credentials.password = this.loginForm.controls['password'].value;
    // console.log(this.credentials)
    // this.appState$ = this.authService.login$(this.credentials)
    //   .pipe(
    //     map((response) => {
    //       console.log('la reponse', response.access_token)
    //       this.tokenService.saveToken(response.access_token);
    //           // this.tokenService.saveAuthorities(data.roles);
    //           // this.tokenService.saveUsername(data.username);
    //           this.isLoginFailed = false;
    //           this.isLoggedIn = true;
    //       this.dataSubject.next(
    //           {
    //             ...response, data: { logins: [response.data.login, ...this.dataSubject.value.data.logins]}
    //           }
    //         );
    //       this.isLoading.next(false);
    //       return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value};
    //     }),
    //     startWith({dataState: DataState.LOADING_STATE, appData: null}),
    //     catchError((error => {
    //       // this.notificationService.onError(error);
    //       this.isLoading.next(false);
    //       // this.errorMessage = error.error.message.toString();
    //       console.error("message d'erreur", error.message)
    //       // console.log("message d'erreur1", this.errorMessage);
    //       return of({dataState: DataState.ERROR_STATE, error: error});
    //     }))
    //   );
    this.credentials.login = this.loginForm.controls['username'].value;
    this.credentials.password = this.loginForm.controls['password'].value;
    this.authService.login(this.credentials).subscribe(
      (data) => {
        this.user = data;

        this.tokenService.saveToken(data);
        this.tokenService.saveEmail(this.credentials.login);
        this.isLoading.next(false);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
      },
      (error: any) => {
        this.errorMessage = error.error.message;
        // this.notifsService.onError(error.error.error[0], 'Echec de connexioon')
        this.isLoginFailed = true;
        this.isLoading.next(false);
      }
    );
  }

  connect(){

  }


}
