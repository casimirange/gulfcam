import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {TokenService} from "../../../_services/token/token.service";
import {BnNgIdleService} from "bn-ng-idle";
import {StatusAccountService} from "../../../_services/status/status-account.service";
import {Observable} from "rxjs";
import {ConfigOptions} from "../../../configOptions/config-options";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firstName: string | null = '';
  lastName: string | null = '';
  isLogged: boolean = false;
  roleUser = localStorage.getItem('userAccount').toString()
  constructor(private tokenService: TokenService, private statusAccountSercive: StatusAccountService, public globals: ConfigOptions) { }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged();
    this.firstName = localStorage.getItem('firstName')
    this.lastName = localStorage.getItem('firstName')
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
}
