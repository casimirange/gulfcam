import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsersService} from "../../../_services/users/users.service";
import {ISignup} from "../../../_model/signup";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Router} from "@angular/router";
<<<<<<< HEAD
=======
import {StatusUserService} from "../../../_services/status/status-user.service";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {AESUtil, aesUtil, key} from "../../../_helpers/aes.js";
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

@Component({
  selector: 'app-index-users',
  templateUrl: './index-users.component.html',
  styleUrls: ['./index-users.component.scss']
})
export class IndexUsersComponent implements OnInit, OnDestroy {

  users: ISignup[] = []
  page: number = 1;
  totalPages: number;
  totalElements: number;
<<<<<<< HEAD
  size: number = 10;
  constructor(private modalService: NgbModal, private userService: UsersService, private notifsService: NotifsService, private router: Router) { }
=======
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
  aes = aesUtil;
  keys = key
  private mySubscription2: Subscription;
  load: boolean;
  constructor(private modalService: NgbModal, private userService: UsersService, private notifsService: NotifsService,
              private storeService: StoreService, private statusAccountService: StatusAccountService,
              private statusUserService: StatusUserService, private router: Router,) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

  ngOnInit(): void {
    this.getUsers()
    this.getStores()
  }

  getUsers(): void{
    this.appState$ = this.userService.users$(this.nameFilter, this.lastNameFilter, this.accountFilter, this.statusFilter, this.storeFilter, this.page - 1, this.size)
      .pipe(
        map(response => {
          // console.log(response)
          // console.log(response.key)
          // console.log(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          // this.notifsService.onSuccess('chargement des utilisateurs')
          return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
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

<<<<<<< HEAD
  pageChange(event: number){
=======
  getStatusAccount(status: string): string {
    return this.statusAccountService.allStatus(status)
  }

  getStatusUser(status: string): string {
    return this.statusUserService.allStatus(status)
  }

  pageChanges(event: number){
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
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
    this.load = true
    this.mySubscription2 = this.storeService.getStore().subscribe(
      resp => {
        this.stores = JSON.parse(aesUtil.decrypt(key,resp.key.toString())).content
        this.load = false
      },
      error => {
        // this.notifsService.onError(error.error.message, 'échec chargement magasins')
      }
    )
  }

  showDetails(user: ISignup) {
    let rout = aesUtil.encrypt(key, user.userId.toString())
    while (rout.includes('/')){
      rout = aesUtil.encrypt(key, user.userId.toString())
    }
    this.router.navigate(['/users/details', rout])
  }

  decryptData(data: any) : string{
    return aesUtil.decrypt(key, data.toString()) as string;
  }

  ngOnDestroy(): void {
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null
  }
}
