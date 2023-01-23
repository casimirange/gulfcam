import { Injectable } from '@angular/core';
import {IToken} from "../../_model/token";
import {Router} from "@angular/router";
import {IUser} from "../../_model/user";
import {ISignup} from "../../_model/signup";
import {BnNgIdleService} from "bn-ng-idle";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private roles: string[] = [];
  constructor(private router: Router, private bnIdle: BnNgIdleService,) { }

  saveToken(token: IToken){
    localStorage.setItem('bearerToken', <string>token.access_token);
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    localStorage.setItem('exp', date.toString())
    this.router.navigate(['/auth/otp'])
  }

  saveEmail(email: string){
    localStorage.setItem('email', <string>email);
  }

  getTimer(){
    return localStorage.getItem('exp')
  }

  public saveAuthorities(authorities: string[]) {
    localStorage.setItem('Roles', JSON.stringify(authorities));
  }

  saveUserInfo(user: ISignup){
    localStorage.setItem('firstName', user.firstName)
    localStorage.setItem('lastName', user.lastName)
    localStorage.setItem('uid', user.internalReference.toString())
    localStorage.setItem('id', user.userId.toString())
    localStorage.setItem('email', user.email)
    localStorage.setItem('userAccount', user.typeAccount.name)
    localStorage.setItem('store', user.idStore.toString())
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
    // localStorage.removeItem('bearerToken');
    localStorage.setItem('bearerToken', <string>token);
    if (this.isRedirect()){
      this.router.navigate([localStorage.getItem('url').toString()])
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
    localStorage.removeItem('id')
    // localStorage.setItem('roles', <string>token.roles);
    this.router.navigate(['auth']);
    this.bnIdle.stopTimer()
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
    this.router.navigate(['auth']);
  }

  isLogged(): boolean{
    const token = localStorage.getItem(('bearerToken'))
    return !! token;
  }

  isRedirect(): boolean{
    const url = localStorage.getItem('url')
    return !! url;
  }

  getToken(): string | null{
    return localStorage.getItem('bearerToken');
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
