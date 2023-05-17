import { Injectable } from '@angular/core';
import {Products} from "../../_model/products";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Order} from "../../_model/order";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Client} from "../../_model/client";
import {catchError} from "rxjs/operators";
import {Status} from "../../_model/status";
import {log} from "util";

export const httpOptions = {
  responseType: 'arraybuffer' as 'json'
};
export const data: FormData = new FormData();

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

  getOrdersWithPagination(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.order+ `?page=${page}&size=${size}`)
  }

  getOrderByRef(internalReference: number): Observable<any>{
    return this.http.get<any>(environment.order + `/${internalReference}`,)
  }



  getOrderByClient(clientInternalReference: number): Observable<any>{
    return this.http.get<any>(environment.order + `/client/${clientInternalReference}`,)
  }

  getOrderByStore(storeInternalRef: number): Observable<any>{
    return this.http.get<any>(environment.order + `/store/${storeInternalRef}`,)
  }

  sendOrderByClient(clientInternalReference: string): Observable<any>{
    return this.http.get<any>(environment.order + `/export/excel/client/${clientInternalReference}`,)
  }

  denyOrder(internalReference: string, idManager: string, reason: string): Observable<any>{
    return this.http.post<any>(environment.order + `/cancel/${internalReference}?idCommercialAttache=${idManager}&reasonForCancellation=${reason}`, null)
  }

  getProforma(orderInternalReference: string): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.get<any>(environment.order + `/invoice/${orderInternalReference}`, httpOptions)
  }

  getFile(orderInternalReference: string, type: string, docType: string): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.get<any>(environment.order + `/file/${orderInternalReference}/downloadFile?type=${type}&docType=${docType}`, httpOptions)
  }

  getReçu(orderInternalReference: string, type: string): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.post<any>(environment.order + `/document/${orderInternalReference}?type=${type}`,null, httpOptions)
  }

  acceptOrder(orderInternalReference: string, idFund: string, idPaymentMethod: string, paymentRef: string, docType: string, file: File): Observable<any>{
    const data: FormData = new FormData();
    data.append('file', file);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.post<any>(environment.order + `/accept/${orderInternalReference}?idFund=${idFund}&idPaymentMethod=${idPaymentMethod}&paymentReference=${paymentRef}&docType=${docType}`, data, httpOptions)
  }

  validOrder(orderInternalReference: string, idManagerCoupon: string, file: File): Observable<any>{
    const data: FormData = new FormData();
    data.append('file', file);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.post<any>(environment.order + `/valid/delivery/${orderInternalReference}?idSalesManager=${idManagerCoupon}`, data, httpOptions)
  }

  payOrder(orderInternalReference: string, idManagerCoupon: string): Observable<any>{
    return this.http.post<any>(environment.order + `/pay/${orderInternalReference}?idSalesManager=${idManagerCoupon}`, null)
  }

  deliveryOrder(orderInternalReference: string, idManagerCoupon: string): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.post<any>(environment.order + `/delivery/${orderInternalReference}?idSalesManager=${idManagerCoupon}`, null, httpOptions)
  }

  /**
   *
   * @param page
   * @param size
   */

  orders$ = (page: number, size: number) => <Observable<CustomResponse<Order>>>
    this.http.get<CustomResponse<Order>>(environment.order + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  filterOrders$ = (store?: string, client?: string, date?: string, ref?: string, statut?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.order + `/filter?page=${page}&size=${size}&store=${store}&client=${client}&date=${date}&ref=${ref}&status=${statut}`,)
      .pipe(catchError(this.handleError));

  ordersByStore$ = (storeInternalRef: number, page: number, size: number) => <Observable<CustomResponse<Order>>>
    this.http.get<CustomResponse<Order>>(environment.order + `/store/${storeInternalRef}?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  filterByStatus$ = (status: Status, page: number, size: number, response: CustomResponse<Order>) => <Observable<CustomResponse<Order>>>
    new Observable<CustomResponse<Order>>(
      subscriber => {
        console.log(response)
      }
    ).pipe(catchError(this.handleError))

  addOrder$ = (order: Order) => <Observable<any>>
    this.http.post<any>(environment.order, order)
      .pipe(catchError(this.handleError));

  showOrder$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.order+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  clientOrders$ = (page: number, size: number, internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.order+`/client/${internalRef}?page=${page}&size=${size}`)
      .pipe(catchError(this.handleError));

  sendMailOrder$ = (internalRef: number) => <Observable<Order>>
    this.http.get<Order>(environment.order+`/export/excel/client/${internalRef}`)
      .pipe(catchError(this.handleError));

  denyOrder$ = (internalReference: number, idManager: number, reason: string) => <Observable<Order>>
    this.http.post<Order>(environment.order + `/cancel/${internalReference}?idManagerCoupon=${idManager}&reasonForCancellation=${reason}`, null)
      .pipe(catchError(this.handleError));

  proforma$ = (internalReference: number) => <Observable<Order>>
    this.http.get<Order>(environment.order + `/invoice/${internalReference}`, httpOptions)
      .pipe(catchError(this.handleError));

  file$ = (orderInternalReference: number, type: string, docType: string) => <Observable<Order>>
    this.http.get<Order>(environment.order + `/file/${orderInternalReference}/downloadFile?type=${type}&docType=${docType}`, httpOptions)
      .pipe(catchError(this.handleError));

  reçu$ = (orderInternalReference: number, type: string) => <Observable<Order>>
    this.http.post<Order>(environment.order + `/document/${orderInternalReference}?type=${type}`,null, httpOptions)
      .pipe(catchError(this.handleError));

  acceptOrder$ = (orderInternalReference: number, idFund: number, idPaymentMethod: number, paymentRef: string, docType: string, file: File) => {
    data.append('file', file);
    <Observable<Order>>
    this.http.post<Order>(environment.order + `/accept/${orderInternalReference}?idFund=${idFund}&idPaymentMethod=${idPaymentMethod}&paymentReference=${paymentRef}&docType=${docType}`, data, httpOptions)
      .pipe(catchError(this.handleError));}

  validOrder$ = (orderInternalReference: number, idManagerCoupon: number, file: File) => {
    data.append('file', file);
    <Observable<Order>>
    this.http.post<Order>(environment.order + `/valid/delivery/${orderInternalReference}?idManagerCoupon=${idManagerCoupon}`, data, httpOptions)
      .pipe(catchError(this.handleError));}

  deliveryOrder$ = (orderInternalReference: number, idManagerCoupon: number) => {
    <Observable<Order>>
      this.http.post<Order>(environment.order + `/delivery/${orderInternalReference}?idManagerCoupon=${idManagerCoupon}`, null, httpOptions)
      .pipe(catchError(this.handleError));}

  payOrder$ = (orderInternalReference: number, idManagerCoupon: number) => <Observable<Order>>
    this.http.post<Order>(environment.order + `/pay/${orderInternalReference}?idSalesManager=${idManagerCoupon}`, null)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message }` )
  }
}
