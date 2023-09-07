import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICredentialsSignup} from "../../../_model/signup";
import {IToken} from "../../../_model/token";
import {BehaviorSubject, Observable} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {AuthService} from "../../../_services/auth.service";
import {Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  signup: FormGroup ;
  credentials: ICredentialsSignup = new ICredentialsSignup()
  user?: IToken;
  errorMessage = '';
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  // readonly DataState = DataState;
  form: any;
  constructor(
    private fb: FormBuilder, private authService: AuthService, private router: Router,
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
  }


  ngOnInit(): void {
  }


  saveUser() {
    this.isLoading.next(true);
    this.credentials = this.signup.value;
    this.credentials.montant = +this.signup.controls["montant"].value

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

}
