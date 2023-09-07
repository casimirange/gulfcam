import { Pipe, PipeTransform } from '@angular/core';
import {catchError, map, startWith} from "rxjs/operators";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {Order} from "../../../_model/order";
import {DataState} from "../../../_enum/data.state.enum";
import {OrderService} from "../../../_services/order/order.service";
import {StatusOrderService} from "../../../_services/status/status-order.service";
import {ConfigOptions} from "../../../configOptions/config-options";

@Pipe({
  name: 'clientNameFilter'
})
export class ClientNameFilterPipe implements PipeTransform {
  orderState$: Observable<AppState<CustomResponse<Order>>>;
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Order>>(null);
  private isSearching = new BehaviorSubject<boolean>(false);
  isSearching$ = this.isSearching.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 20;
  orderService: OrderService;
  transform(value: any, args: any) {
    if (value.length === 0 || args === ""){
      return value;
    }
    const clients = []
    for (const client of value){

      if (client['completeName'].includes(args)){
        clients.push(client)
      }
    }
    return clients;
  }


  // transform(value: any, args: any) {
  //   if (value.length === 0 || args === ""){
  //     return value;
  //   }
  //   this.orderState$ = this.orderService.filterOrders$(this.page - 1, this.size)
  //     .pipe(
  //       map(response => {
  //         this.dataSubjects.next(response)
  //         return {dataState: DataState.LOADED_STATE, appData: response}
  //       }),
  //       startWith({dataState: DataState.LOADING_STATE, appData: null}),
  //       catchError((error: string) => {
  //         return of({dataState: DataState.ERROR_STATE, error: error})
  //       })
  //     )
  // }

}
