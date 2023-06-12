import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {CustomResponse} from "../../_interfaces/custom-response";
import {catchError} from "rxjs/operators";
import {Coupon} from "../../_model/coupon";
import {Order} from "../../_model/order";

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  getCoupons(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.coupon+`?page=${page}&size=${size}`)
  }

  getCouponsByStation(idStation: string, page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.coupon+`/station/${idStation}?page=${page}&size=${size}`)
  }

  getCouponsBySerialNumber(coupon: string): Observable<any>{
    return this.http.get<any>(environment.coupon+`/serial/${coupon}`)
  }

  getCouponByInternalRel(coupon: number): Observable<Coupon>{
    return this.http.get<Coupon>(environment.coupon+`/${coupon}`)
  }

  sendCouponByClient(clientInternalReference: string): Observable<any>{
    return this.http.get<any>(environment.coupon + `/export/excel/client/${clientInternalReference}`,)
  }

  acceptCoupon(serialNumber: string, stationId: any): Observable<any>{
    return this.http.put<any>(environment.coupon+`/accept/serial/${serialNumber}`, stationId)
  }

  affectCouponClient(serialNumber: string, idClient: string): Observable<any>{
    return this.http.post<any>(environment.coupon+`/affect/serial/${serialNumber}?idClient=${idClient}`, null)
  }

  /**
   *
   */

  coupons$ = (page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.coupon + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  affectClientCoupon$ = (serialNumber: string, idClient: number) => <Observable<Coupon>>
    this.http.post<Coupon>(environment.coupon+`/affect/serial/${serialNumber}?idClient=${idClient}`, null)
      .pipe(catchError(this.handleError));

  acceptCoupon$ = (serialNumber: string, stationId: any) => <Observable<Coupon>>
    this.http.put<Coupon>(environment.coupon+`/accept/serial/${serialNumber}`, stationId)
      .pipe(catchError(this.handleError));

  sendMailCoupon$ = (clientInternalReference: number) => <Observable<Coupon>>
    this.http.get<Coupon>(environment.coupon + `/export/excel/client/${clientInternalReference}`,)
      .pipe(catchError(this.handleError));

  couponByStation$ = (idStation: number, serialNumber?: string, statut?: string, type?: string, clientName?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.coupon+`/station/${idStation}?page=${page}&size=${size}&serialnumber=${serialNumber}&status=${statut}&client=${clientName}&type=${type}`)
      .pipe(catchError(this.handleError));

  couponByStationNotCreditNote$ = (idStation: number, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.coupon+`/station/notCreditNote/?station=${idStation}&page=${page}&size=${size}`)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }

  filterCoupon$ = (serialNumber?: string, statut?: string, type?: string, clientName?: string, stationName?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.coupon + `/filter?page=${page}&size=${size}&serialnumber=${serialNumber}&status=${statut}&client=${clientName}&type=${type}&station=${stationName}`,)
      .pipe(catchError(this.handleError));
}
