import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ForgetPassword} from "../../../_interfaces/forget-password";
import {IToken} from "../../../_model/token";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../../../_services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ResetPassword} from "../../../_model/resetPassword";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  project = 'ADELI';
  socity = 'ADELI';
  forgetForm: FormGroup;
  credentials: ResetPassword = new ResetPassword()
  user?: IToken;
  errorMessage = '';

  // appState$: Observable<AppState<CustomResponseLogin>> = new Observable<AppState<CustomResponseLogin>>();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  form: any;
  pass = ''
  confirm_pass = ''
  code: string;
  constructor(
    private fb: FormBuilder, private authService: AuthService, private router: Router, private notifsService: NotifsService, private route: ActivatedRoute
  ) {
    this.forgetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]],
      cpass: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]]
    });
    this.form = this.forgetForm.controls;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          // console.log(params); // { orderby: "price" }
          this.code = params.code;

        }
      );
    // console.log(this.code); // price
  }

  onSubmit() {
    this.isLoading.next(true);
    this.credentials.code = this.code;
    this.credentials.password = aesUtil.encrypt(key, this.forgetForm.controls['password'].value.toString());
    this.credentials.email = aesUtil.encrypt(key, this.forgetForm.controls['username'].value.toString());
    this.authService.resetPassword(this.credentials, this.credentials.code).subscribe(
      (data) => {
        // console.log(data)
        this.notifsService.onSuccess('Mot de passe mis à jour')
        this.router.navigate(['auth/']);
      },
      (error: any) => {
        this.errorMessage = error.error.error;
        this.isLoading.next(false);
      }
    );
  }

}
