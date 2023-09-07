import { Injectable } from '@angular/core';
import {IToken} from "../../_model/token";
import {Router} from "@angular/router";
import {IUser} from "../../_model/user";
import {ISignup} from "../../_model/signup";
import {BnNgIdleService} from "bn-ng-idle";
import {timeout} from "rxjs/operators";
import IdleTimer from "../../_helpers/idleTimer.js";
import {NotifsService} from "../notifications/notifs.service";
import Swal from "sweetalert2";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {aesUtil, key} from "../../_helpers/aes.js";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private roles: string[] = [];

  constructor(private router: Router, private bnIdle: BnNgIdleService, private modalService: NgbModal) { }

  saveToken(token: IToken){
    let rout = aesUtil.encrypt(key, <string>token.access_token)
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key,  <string>token.access_token)
    }
    localStorage.setItem('bearerToken', rout);
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    localStorage.setItem('exp', date.toString())
    this.router.navigate(['/auth/otp'])
  }

  saveEmail(email: string){
    localStorage.setItem('email', email);
  }

  getTimer(){
    return localStorage.getItem('exp')
  }

  public saveAuthorities(authorities: string[]) {
    // console.log("authoritties", authorities)
    localStorage.setItem('Roles', JSON.stringify(authorities))
  }

  saveUserInfo(user: ISignup){
<<<<<<< HEAD
    localStorage.setItem('firstName', user.firstName)
    localStorage.setItem('lastName', user.lastName)
    localStorage.setItem('uid', user.userId.toString())
    localStorage.setItem('id', user.userId.toString())
    localStorage.setItem('email', user.email)
    localStorage.setItem('userAccount', user.typeAccount.name.toString())
=======
    let uid = aesUtil.encrypt(key, user.internalReference.toString())
    while (uid.includes('/')){
      uid = aesUtil.encrypt(key, user.internalReference.toString())
    }
    let id = aesUtil.encrypt(key, user.userId.toString())
    while (id.includes('/')){
      id = aesUtil.encrypt(key, user.userId.toString())
    }
    let store = aesUtil.encrypt(key, user.iStore)
    while (store.includes('/')){
      store = aesUtil.encrypt(key, user.iStore)
    }
    localStorage.setItem('firstName', aesUtil.encrypt(key, user.firstName))
    localStorage.setItem('lastName', aesUtil.encrypt(key, user.lastName))
    localStorage.setItem('uid', uid)
    localStorage.setItem('id', id)
    localStorage.setItem('store', store)
  }

  saveUserAccount(account: any){
    localStorage.setItem('userAccount', aesUtil.encrypt(key, account.toString()))
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
  }

  userInactivity(){
    this.bnIdle.startWatching(1500).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        localStorage.removeItem('bearerToken');
        this.bnIdle.stopTimer()
      }
    });
  }

  saveRefreshToken(token: string){
    let rout = aesUtil.encrypt(key, token)
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, token)
    }
    localStorage.setItem('bearerToken', rout);

    new IdleTimer({
      timeout: 1800, //expired after 600 secs
      onTimeout: () => {
        localStorage.setItem('url', this.router.url)
        this.clearTokenExpired();
        this.modalService.dismissAll()
        Swal.fire({
          title: 'Inactivité',
          html: 'Nous avons constaté que vous n\'êtes plus actif sur la plateforme depuis un moment',
          icon: 'info',
          footer: '<a >Veuillez vous reconnecter de nouveau</a>',
          showCancelButton: false,
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          allowEscapeKey: false,
          focusConfirm: false,
          backdrop: `rgba(0, 0, 0, 0.4)`
        }).then((result) => {
          if (result.value) {
          }
        })
      }
    }).startInterval();
    if (this.isRedirect()){
      this.router.navigate(['/dashboard'])
      // this.router.navigate([localStorage.getItem('url').toString()])
      localStorage.removeItem('url')
      this.userInactivity()
    }else {
      this.router.navigate(['/dashboard'])
    }

    // localStorage.setItem('username', <string>token.username);
    // localStorage.setItem('roles', <string>token.roles);
    // token.roles?.forEach(role => {
    //   if (role.includes('ROLE_USER')) {
    //     this.router.navigate(['commandes']);
    //   }
    //   if (role.includes('ROLE_ADMIN')) {
    //     this.router.navigate(['/']);
    //   }
    //
    // });
  }

  clearToken(): void{
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('username');
    localStorage.removeItem('Roles');
    localStorage.removeItem('email');
    localStorage.removeItem('exp');
    localStorage.removeItem('url');
    localStorage.removeItem('userAccount');
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('uid')
<<<<<<< HEAD
    localStorage.removeItem('id')
=======
    localStorage.removeItem('store')
    localStorage.removeItem('id')
    localStorage.removeItem('_expiredTime')
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
    // localStorage.setItem('roles', <string>token.roles);
    this.router.navigate(['auth']);
    // this.bnIdle.stopTimer()
  }

  clearTokenExpired(): void{
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName')
    localStorage.removeItem('userAccount')
    localStorage.removeItem('lastName')
    localStorage.removeItem('uid')
    localStorage.removeItem('id')
    localStorage.removeItem('Roles')
    localStorage.removeItem('exp')
    localStorage.removeItem('store')
    localStorage.removeItem('_expiredTime')
    this.router.navigate(['auth']);
    // this.bnIdle.stopTimer()
  }

  isLogged(): boolean{
    const token = localStorage.getItem(('bearerToken')) ? aesUtil.decrypt(key, localStorage.getItem(('bearerToken'))).toString() : null
    return !! token;
  }

  isRedirect(): boolean{
    const url = localStorage.getItem('url')
    return !! url;
  }

  getToken(): string | null{
    return localStorage.getItem('bearerToken') ? aesUtil.decrypt(key, localStorage.getItem('bearerToken')).toString() : null;
  }

  public getAuthorities(): string[] {
    this.roles = [];

    // if (sessionStorage.getItem(TOKEN_KEY)) {
    //   JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
    //     this.roles.push(authority.authority);
    //   });
    // }

    return this.roles;
  }

}
