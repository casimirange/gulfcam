import {Component, OnInit, TemplateRef} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Stock} from "../../../_model/stock";
import {MvtStockService} from "../../../_services/stock/mvt-stock.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";
import {Client} from "../../../_model/client";

@Component({
  selector: 'app-index-mvt-stock',
  templateUrl: './index-mvt-stock.component.html',
  styleUrls: ['./index-mvt-stock.component.css']
})
export class IndexMvtStockComponent implements OnInit {

  mvtStocks: Stock[] = [];
  page: number = 1;
  size: number = 20;
  appState$: Observable<AppState<CustomResponse<Stock>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Stock>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []

  constructor(private notifService: NotifsService, private mvtStockService: MvtStockService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key, authority));
    });
  }

  ngOnInit(): void {
    this.getMvtStocks();
  }

  getMvtStocks() {
    this.appState$ = this.mvtStockService.stockMovement$(this.page - 1, this.size)
      .pipe(
        map(response => {
          // console.log(JSON.parse(aesUtil.decrypt(key, response.key.toString())))
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<Stock>)
          this.notifService.onSuccess('chargement des mouvements du stock')
          return {
            dataState: DataState.LOADED_STATE,
            appData: JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<Stock>
          }
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number) {
    this.page = event
    this.appState$ = this.mvtStockService.stockMovement$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<Stock>)
          return {
            dataState: DataState.LOADED_STATE,
            appData: JSON.parse(aesUtil.decrypt(key, response.key.toString())) as CustomResponse<Stock>
          }
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

}
