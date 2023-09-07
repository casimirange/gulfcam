import { Component, OnInit } from '@angular/core';
import {Unite} from "../../../_model/unite";
import {UnitsService} from "../../../_services/units/units.service";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Carton} from "../../../_model/carton";
import {catchError, map, startWith} from "rxjs/operators";
import {StoreHouse} from "../../../_model/storehouse";
import {DataState} from "../../../_enum/data.state.enum";

@Component({
  selector: 'app-unites',
  templateUrl: './unites.component.html',
  styleUrls: ['./unites.component.css']
})
export class UnitesComponent implements OnInit {
  appState$: Observable<AppState<Unite[]>>;
  readonly DataState = DataState;
  constructor(private unitService: UnitsService, private activatedRoute: ActivatedRoute, private storeService: StoreService,) { }

  ngOnInit(): void {
    this.getUnitByStore()
  }

  getUnitByStore(){
    this.activatedRoute.params.subscribe(params => {
      this.appState$ = this.storeService.unitByStore$(params['id'].toString())
        .pipe(
          map(response => {
            return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )
      // this.storeService.getUnitByStore(params['id'] as number).subscribe(
      //   resp => {
      //     // console.log(JSON.parse(aesUtil.decrypt(key, resp.key.toString())))
      //     this.units = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
      //   }
      // )
    })
  }

  formatNumber(amount: number): string{
    return amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }
}
