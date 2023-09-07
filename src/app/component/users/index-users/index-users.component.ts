import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsersService} from "../../../_services/users/users.service";
import {ISignup} from "../../../_model/signup";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index-users',
  templateUrl: './index-users.component.html',
  styleUrls: ['./index-users.component.scss']
})
export class IndexUsersComponent implements OnInit {

  users: ISignup[] = []
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  constructor(private modalService: NgbModal, private userService: UsersService, private notifsService: NotifsService, private router: Router) { }

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

  pageChange(event: number){
    this.page = event
    this.getUsers()
  }

  showDetails(user: ISignup) {
    this.router.navigate(['/users/details', user.userId])
  }
}
