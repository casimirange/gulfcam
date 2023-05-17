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
import {aesUtil, key} from "../../../_helpers/aes";

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
  id: any
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
    console.log(aesUtil.decrypt(key, localStorage.getItem('id').toString()))
    this.id = aesUtil.encrypt(key, (aesUtil.decrypt(key, this.route.snapshot.paramMap.get('id').toString()) as string));
    this.getUser()
  }

  getUser() {
    // this.id = aesUtil.encrypt(key, (aesUtil.decrypt(key, this.route.snapshot.paramMap.get('id').toString()) as string));

    this.userService.getUser(this.id).subscribe(
      resp => {
        console.log(JSON.parse(aesUtil.decrypt(key,resp.key.toString())))
        this.user = JSON.parse(aesUtil.decrypt(key,resp.key.toString()))

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
    body.oldPassword = aesUtil.encrypt(key, this.changePwd.controls['oldpassword'].value);
    body.password = aesUtil.encrypt(key, this.changePwd.controls['password'].value);
    const id = aesUtil.encrypt(key, (aesUtil.decrypt(key, this.route.snapshot.paramMap.get('id').toString()) as string));
    console.log(id)
    console.log(body)

    this.userService.changePassword(this.id, body).subscribe(
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
