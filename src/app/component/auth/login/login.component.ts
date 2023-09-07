import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../_services/auth.service";
import {TokenService} from "../../../_services/token/token.service";
import {ICredentials} from "../../../_interfaces/credentials";
import {IToken} from "../../../_model/token";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {catchError, count, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {NotifsService} from "../../../_services/notifications/notifs.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  project = 'ADELI';
  socity = 'ADELI';
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
  count: number = 0;
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


  login() {
    this.isLoading.next(true);
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
        this.errorMessage = error.error.error[0];
        this.count += this.count
        this.isLoginFailed = true;
        this.isLoading.next(false);
      }
    );
  }

  connect(){

  }


}
