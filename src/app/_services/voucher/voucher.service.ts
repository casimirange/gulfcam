import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {TypeVoucher} from "../../_model/typeVoucher";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {Store} from "../../_model/store";

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private http: HttpClient) { }

  createTypevoucher(tVoucher: TypeVoucher): Observable<any>{
    return this.http.post<any>(environment.typeVoucher, tVoucher)
  }

  getTypevoucher(): Observable<any>{
    return this.http.get<any>(environment.typeVoucher)
  }

  getTypevoucherByInternalRef(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.typeVoucher+`/${internalRef}`)
  }

  deleteTypevoucher(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.typeVoucher+`/${internalref}`)
  }

  updateTypeVoucher(tVoucher: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.typeVoucher+`/${internalRef}`, tVoucher);
  }

  voucher$ = (page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.typeVoucher + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  addVoucher$ = (store: TypeVoucher) => <Observable<any>>
    this.http.post<any>(environment.typeVoucher, store)
      .pipe(catchError(this.handleError));

  updateVoucher$ = (store: TypeVoucher, internalRef: number) => <Observable<any>>
    this.http.put<any>(environment.typeVoucher+`/${internalRef}`, store)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
