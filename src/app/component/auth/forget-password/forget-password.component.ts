import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IToken} from "../../../_model/token";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../../../_services/auth.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Router} from "@angular/router";
import {ForgetPassword} from "../../../_interfaces/forget-password";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  project = 'Gulfcam';
  socity = 'Gulfcam';
  forgetForm: FormGroup;
  credentials: ForgetPassword = new ForgetPassword()
  user?: IToken;
  errorMessage = '';

  // appState$: Observable<AppState<CustomResponseLogin>> = new Observable<AppState<CustomResponseLogin>>();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  form: any;

  constructor(
    private fb: FormBuilder, private authService: AuthService, private router: Router, private notifsService: NotifsService
  ) {
    this.forgetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
    this.form = this.forgetForm.controls;
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.isLoading.next(true);
    this.credentials.login = this.forgetForm.controls['username'].value;
    this.authService.forgetPassword(this.credentials).subscribe(
      (data) => {
        console.log(data)
        this.notifsService.onSuccess(data.message)
        this.router.navigate(['auth/reset-password']);
      },
      (error: any) => {
        console.log(error)
        this.errorMessage = error.error.error;
        this.isLoading.next(false);
      }
    );
  }
}


