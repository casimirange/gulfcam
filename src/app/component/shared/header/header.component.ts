import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {TokenService} from "../../../_services/token/token.service";
import {BnNgIdleService} from "bn-ng-idle";
import {StatusAccountService} from "../../../_services/status/status-account.service";
import {Observable} from "rxjs";
import {ConfigOptions} from "../../../configOptions/config-options";
import {Store} from "../../../_model/store";
import {Router} from "@angular/router";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName: string | null = '';
  lastName: string | null = '';
  isLogged: boolean = false;
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString()).toString()
  constructor(private tokenService: TokenService, private statusAccountSercive: StatusAccountService, public globals: ConfigOptions, private router: Router) { }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged();
    this.firstName = aesUtil.decrypt(key, localStorage.getItem('firstName')).toString()
    this.lastName = aesUtil.decrypt(key, localStorage.getItem('lastName')).toString()
  }

  logout(){
    this.tokenService.clearToken();
  }

  getStatusAccount(status: string): string {
    return this.statusAccountSercive.allStatus(status)
  }

  @HostBinding('class.isActive')
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  toggleHeaderMobile() {
    this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
  }

  showProfile() {
    this.router.navigate(['/profile/user', localStorage.getItem('id')])
  }
}
