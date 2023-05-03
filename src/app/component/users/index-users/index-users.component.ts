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
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";

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
  size: number = 20;
  role: string[] = []
  appState$: Observable<AppState<CustomResponse<ISignup>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<ISignup>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  onFilter: boolean = false;
  storeFilter? = ''
  accountFilter? = ''
  statusFilter? = ''
  nameFilter? = ''
  lastNameFilter? = ''
  constructor(private modalService: NgbModal, private userService: UsersService, private notifsService: NotifsService,
              private storeService: StoreService, private statusAccountService: StatusAccountService,
              private statusUserService: StatusUserService, private router: Router,) {
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
  }

  ngOnInit(): void {
    this.getUsers()
    this.getStores()
  }

  getUsers(): void{
    this.appState$ = this.userService.users$(this.nameFilter, this.lastNameFilter, this.accountFilter, this.statusFilter, this.storeFilter, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          // this.notifsService.onSuccess('chargement des utilisateurs')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
    // this.userService.getAllUsersWithPagination(this.page-1, this.size).subscribe(
    //   resp => {
    //     this.users = resp.content;
    //     this.size = resp.size
    //     this.totalPages = resp.totalPages
    //     this.totalElements = resp.totalElements
    //     this.notifsService.onSuccess('Chargement des utilisateurs')
    //   },
    //   error => {
    //     // this.notifsService.onError(error.error.message, "échec de chargement des utilisateurs")
    //   }
    // )
  }



  showFilter() {
    this.onFilter = !this.onFilter

    if (!this.onFilter) {
      this.accountFilter = '';
      this.lastNameFilter = '';
      this.nameFilter = '';
      this.storeFilter = '';
      this.statusFilter = '';
      this.getUsers()
    }
  }

  getStatusAccount(status: string): string {
    return this.statusAccountService.allStatus(status)
  }

  getStatusUser(status: string): string {
    return this.statusUserService.allStatus(status)
  }

  pageChanges(event: number){
    this.page = event
    this.getUsers()
    // this.users = []
    // this.userService.getAllUsersWithPagination(this.page-1, this.size).subscribe(
    //   resp => {
    //
    //     this.users = resp.content;
    //     this.size = resp.size
    //     this.totalPages = resp.totalPages
    //     this.totalElements = resp.totalElements
    //   },
    //   error => {
    //     // this.notifsService.onError(error.error.message, "échec de chargement des utilisateurs")
    //   }
    // )
  }

  getStores(){
    this.storeService.getStore().subscribe(
      resp => {
        this.stores = resp.content
      },
      error => {
        // this.notifsService.onError(error.error.message, 'échec chargement magasins')
      }
    )
  }

  showDetails(user: ISignup) {
    this.router.navigate(['/users/details', user.userId])
  }
}
