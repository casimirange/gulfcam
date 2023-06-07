import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {Store} from "../../_model/store";
import {PaiementMethod} from "../../_model/paiement";

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(private http: HttpClient) { }

  createPaymentMethod(payment: any): Observable<any>{
    return this.http.post<any>(environment.paymentMethod, payment)
  }

  getPaymentMethods(): Observable<any>{
    return this.http.get<any>(environment.paymentMethod)
  }

  getPaiementMethodByInternalRef(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.paymentMethod+`/${internalRef}`);
  }

  updatePaiementMethod(payment: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.paymentMethod+`/${internalRef}`, payment);
  }

  payment$ = (page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.paymentMethod + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  addPayment$ = (store: PaiementMethod) => <Observable<any>>
    this.http.post<any>(environment.paymentMethod, store)
      .pipe(catchError(this.handleError));

  updatePayment$ = (store: PaiementMethod, internalRef: number) => <Observable<any>>
    this.http.put<any>(environment.paymentMethod+`/${internalRef}`, store)
      .pipe(catchError(this.handleError));


  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
