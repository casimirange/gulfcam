import { Injectable } from '@angular/core';
import {Products} from "../../_interfaces/products";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Order} from "../../_interfaces/order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }


  saveOrder(order: Order): Observable<any>{
    return this.http.post<any>(environment.order, order)
  }

  getOrders(): Observable<any>{
    return this.http.get<any>(environment.order,)
  }

  getOrderByRef(internalReference: number): Observable<any>{
    return this.http.get<any>(environment.order + `/${internalReference}`,)
  }

  getOrderByClient(clientInternalReference: number): Observable<any>{
    return this.http.get<any>(environment.order + `/client/${clientInternalReference}`,)
  }

  getProforma(orderInternalReference: number): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.get<any>(environment.order + `/invoice/${orderInternalReference}`, httpOptions)
  }

  getFile(orderInternalReference: number): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.get<any>(environment.order + `/invoice/${orderInternalReference}`, httpOptions)
  }

  acceptOrder(orderInternalReference: number, idFund: number, idPaymentMethod: number, paymentRef: string, docType: string, file: File): Observable<any>{
    const data: FormData = new FormData();
    data.append('file', file);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.post<any>(environment.order + `/accept/${orderInternalReference}?idFund=${idFund}&idPaymentMethod=${idPaymentMethod}&paymentReference=${paymentRef}&docType=${docType}`, data, httpOptions)
  }

  payOrder(orderInternalReference: number, idManagerCoupon: number): Observable<any>{
    return this.http.post<any>(environment.order + `/pay/${orderInternalReference}?idManagerCoupon=${idManagerCoupon}`, null)
  }

  deliveryOrder(orderInternalReference: number, idManagerCoupon: number): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.post<any>(environment.order + `/delivery/${orderInternalReference}?idManagerCoupon=${idManagerCoupon}`, null, httpOptions)
  }
}
