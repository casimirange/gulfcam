import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ForgetPassword} from "../../../_interfaces/forget-password";
import {IToken} from "../../../_model/token";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../../../_services/auth.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ResetPassword} from "../../../_model/resetPassword";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  project = 'Gulfcam';
  socity = 'Gulfcam';
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

  constructor(
    private fb: FormBuilder, private authService: AuthService, private router: Router, private notifsService: NotifsService
  ) {
    this.forgetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, ]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]],
      cpass: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]]
    });
    this.form = this.forgetForm.controls;
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.isLoading.next(true);
    this.credentials.code = this.forgetForm.controls['code'].value;
    this.credentials.password = this.forgetForm.controls['password'].value;
    this.credentials.email = this.forgetForm.controls['username'].value;
    this.authService.resetPassword(this.credentials, this.credentials.code).subscribe(
      (data) => {
        console.log(data)
        this.notifsService.onSuccess('Mot de passe mis à jour')
        this.router.navigate(['auth/']);
      },
      (error: any) => {
        console.log(error)
        this.errorMessage = error.error.error;
        this.isLoading.next(false);
      }
    );
  }

}
