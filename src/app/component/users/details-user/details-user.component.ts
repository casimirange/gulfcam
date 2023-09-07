import { Component, OnInit } from '@angular/core';
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../../../_services/users/users.service";
import {ICredentialsSignup, ISignup} from "../../../_model/signup";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IToken} from "../../../_model/token";
import {BehaviorSubject} from "rxjs";
import {RoleUserService} from "../../../_services/role/role-user.service";

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css']
})
export class DetailsUserComponent implements OnInit {

  user: ISignup = new ISignup();
  typeAccount: string = '';
  statusUser: string = '';
  updateUser: FormGroup ;
  credentials: ICredentialsSignup = new ICredentialsSignup()
  activeUser: boolean
  errorMessage = '';
  form: any;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  constructor(private userService: UsersService,  private notifsService: NotifsService, private route: ActivatedRoute,
              private fb: FormBuilder, private roleUserService: RoleUserService) {
    this.updateUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[2,6][0-9]{8}'), Validators.minLength(9), Validators.maxLength(9) ]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9 ]*$')]],
      idStore: ['', [Validators.required]],
      typeAccount: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      position: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.form = this.updateUser.controls;
  }

  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getUser(parseInt(id)).subscribe(
      resp => {
        this.user = resp
        this.typeAccount = this.user.typeAccount.name
        this.statusUser = this.user.status.name
      },
      err => {
        this.notifsService.onError(err.error.message, 'échec chargement de l\'utilisateur')
      }
    )

  }

  enableDesable(){
    this.activeUser = this.user.status.name == 'USER_ENABLED' ? false : true
    this.isLoading.next(true);
    this.userService.enableDesable(this.user.userId, this.activeUser).subscribe(
      resp => {
        this.isLoading.next(false);
        this.notifsService.onSuccess(resp.message)
        this.getUser()
      }
    )
  }

  onSubmit() {
    this.isLoading.next(true);
    this.credentials = this.updateUser.value;
    // const store = this.stores.filter(store => store.localization === this.updateUser.controls['idStore'].value)
    // // for (let st of store){
    // this.credentials.idStore = store[0].internalReference;
    // }

    this.userService.updateUser(this.credentials).subscribe(
      resp => {
        console.log(resp)
        this.isLoading.next(false);
        this.notifsService.onSuccess('utilisateur modifié')
      },
      error => {
        this.isLoading.next(false)
        this.errorMessage = error.error.message;
      }
    )
  }

  getRole(status: string): string {
    return this.roleUserService.allRole(status)
  }

}
