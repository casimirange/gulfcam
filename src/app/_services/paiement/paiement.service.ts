import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(private http: HttpClient) { }

  createPaymentMethod(payment: any): Observable<any>{
    return this.http.post<any>(environment.paymentMethod, payment)
  }

  deletePaymentMethod(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.paymentMethod+`/${internalref}`)
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
}
