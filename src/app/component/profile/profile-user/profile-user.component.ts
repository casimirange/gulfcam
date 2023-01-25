import { Component, OnInit } from '@angular/core';
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {Store} from "../../../_model/store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {UsersService} from "../../../_services/users/users.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {StatusAccountService} from "../../../_services/status/status-account.service";
import {StatusUserService} from "../../../_services/status/status-user.service";
import {RoleUserService} from "../../../_services/role/role-user.service";

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {

  user: ISignup = new ISignup();
  store: Store = new Store();
  changePwd: FormGroup ;
  pass = ''
  confirm_pass = ''
  credentials: ICredentialsSignup = new ICredentialsSignup()
  errorMessage = '';
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  constructor(private userService: UsersService,  private notifsService: NotifsService, private route: ActivatedRoute,
              private router: Router, private fb: FormBuilder) {
    this.changePwd = this.fb.group({
      oldpassword: ['', [Validators.required  ]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]],
      cpass: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*+./;:-]).{8,}$")]]
    });

    this.form = this.changePwd.controls;
  }

  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getUser(parseInt(id)).subscribe(
      resp => {
        this.user = resp
      },
      err => {
        this.notifsService.onError(err.error.message, 'échec chargement de l\'utilisateur')
      }
    )

  }

  onSubmit() {
    this.isLoading.next(true);
    const body = {
      "oldPassword": "string",
      "password": "string"
    }
    body.oldPassword = this.changePwd.controls['oldpassword'].value;
    body.password = this.changePwd.controls['password'].value;
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.changePassword(parseInt(id), body).subscribe(
      resp => {
        console.log(resp)
        this.isLoading.next(false);
        localStorage.removeItem('bearerToken')
        this.notifsService.onSuccess('mot de passe modifié')
        this.router.navigate(['auth/']);
      },
      error => {
        this.isLoading.next(false)
        // this.errorMessage = error.error.message;
      }
    )
  }


}
