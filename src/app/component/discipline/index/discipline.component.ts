import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Pret} from "../../../_model/pret";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {IUser} from "../../../_model/user";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {UsersService} from "../../../_services/users/users.service";
import {PretsService} from "../../../_services/pret/prets.service";
import {catchError, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {Discipline} from "../../../_model/discipline";
import {DisciplineService} from "../../../_services/discipline/discipline.service";

@Component({
  selector: 'app-discipline',
  templateUrl: './discipline.component.html',
  styleUrls: ['./discipline.component.css']
})
export class DisciplineComponent implements OnInit {


  discipline: Discipline;
  // selectedPret: Pret;
  appState$: Observable<AppState<CustomResponse<Discipline>>>;
  readonly DataState = DataState;
  users: CustomResponse<IUser>;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  page: number = 1;
  size: number = 20;
  roleUser = localStorage.getItem('userAccount').toString()
  loadUser: boolean = false
  date = '';
  userFilter = ''
  statusFilter = ''
  constructor(private fb: FormBuilder, private modalService: NgbModal, private notifService: NotifsService,
              private userService: UsersService, private disciplneService: DisciplineService) {

  }

  ngOnInit(): void {
    this.getDiscipline();
    this.getUsers();
  }

  getDiscipline(){
    this.appState$ = this.disciplneService.disciplines$(this.userFilter, this.statusFilter, this.date, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.notifService.onSuccess('chargement des sanctions')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getUsers(){
    this.loadUser = true
    this.userService.getUserss().subscribe(
      resp => {
        this.loadUser = false
        this.users = resp
      }
    )
  }

  open(content: any){
    const modal = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  pageChange(event: number){
    this.page = event
    this.getDiscipline()
  }

}
