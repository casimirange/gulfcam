import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsersService} from "../../../_services/users/users.service";
import {ISignup} from "../../../_model/signup";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StoreService} from "../../../_services/store/store.service";
import {Store} from "../../../_model/store";
import {StatusService} from "../../../_services/status/status.service";
import {StatusAccountService} from "../../../_services/status/status-account.service";
import {Router} from "@angular/router";
import {StatusUserService} from "../../../_services/status/status-user.service";

@Component({
  selector: 'app-index-users',
  templateUrl: './index-users.component.html',
  styleUrls: ['./index-users.component.scss']
})
export class IndexUsersComponent implements OnInit {

  users: ISignup[] = []
  stores: Store[] = []
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 2;
  role: string[] = []
  constructor(private modalService: NgbModal, private userService: UsersService, private notifsService: NotifsService,
              private storeService: StoreService, private statusAccountService: StatusAccountService,
              private statusUserService: StatusUserService, private router: Router,) {
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(): void{
    this.userService.getAllUsersWithPagination(this.page-1, this.size).subscribe(
      resp => {
        this.users = resp.content;
        this.size = resp.size
        this.totalPages = resp.totalPages
        this.totalElements = resp.totalElements
        this.notifsService.onSuccess('Chargement des utilisateurs')
      },
      error => {
        // this.notifsService.onError(error.error.message, "échec de chargement des utilisateurs")
      }
    )
  }

  getStatusAccount(status: string): string {
    return this.statusAccountService.allStatus(status)
  }

  getStatusUser(status: string): string {
    return this.statusUserService.allStatus(status)
  }

  pageChange(event: number){
    this.page = event
    this.getUsers()
  }

  showDetails(user: ISignup) {
    this.router.navigate(['/users/details', user.userId])
  }
}
