import {Component, OnDestroy, OnInit} from '@angular/core';
import {aesUtil, key} from "../../../_helpers/aes";
import {catchError, map, startWith} from "rxjs/operators";
import {Observable, of, Subscription} from "rxjs";
import {Unite} from "../../../_model/unite";
import {AppState} from "../../../_interfaces/app-state";
import {UnitsService} from "../../../_services/units/units.service";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {DataState} from "../../../_enum/data.state.enum";
import {StoreHouseService} from "../../../_services/storeHouse/store-house.service";
import {Piece} from "../../../_model/piece";
import {StoreHouse} from "../../../_model/storehouse";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {
  storeHouse: StoreHouse = new StoreHouse();
  appState$: Observable<AppState<Piece[]>>;
  readonly DataState = DataState;
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  constructor(private activatedRoute: ActivatedRoute, private storeHouseService: StoreHouseService,) { }

  ngOnInit(): void {
    this.getItemsByStoreHouse()
    this.getStoreHouseInfos()
  }

  getStoreHouseInfos(){
    this.activatedRoute.params.subscribe(params => {
      this.mySubscription = this.storeHouseService.getStoreHouseByInternalRef(params['id']).subscribe(
        res => {
          this.storeHouse = JSON.parse(aesUtil.decrypt(key,res.key.toString()));
        }
      )
    })
  }

  getItemsByStoreHouse(){
    this.activatedRoute.params.subscribe(params => {
      this.appState$ = this.storeHouseService.itemByStoreHouse$(params['id'].toString())
        .pipe(
          map(response => {
            return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )
    })
  }

  formatNumber(amount: number): string{
    return amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
  }
}
