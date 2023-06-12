import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Products} from "../../_model/products";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {RequestOpposition} from "../../_model/requestOpposition";
import {CreditNote} from "../../_model/creditNote";
import {Order} from "../../_model/order";
import {catchError} from "rxjs/operators";
import {httpOptions} from "../order/order.service";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Client} from "../../_model/client";

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {

  constructor(private http: HttpClient) { }

  saveCreditNote(product: CreditNote): Observable<any>{
    return this.http.post<any>(environment.creditNote, product)
  }

  getCreditNote(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.creditNote + `?page=${page}&size=${size}`,)
  }

  getCreditNoteByInternalRef(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.creditNote+`/${internalRef}`,)
  }

  validCreditNote(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.creditNote+`/valid/${internalRef}`)
  }

  getCreditNoteByStation(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.creditNote+`/station/${internalRef}`)
  }

  exportCreditNote(noteInternalReference: number): Observable<any>{
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    return this.http.get<any>(environment.creditNote + `/export/${noteInternalReference}`, httpOptions)
  }

  filterCreditNote$ = (status?: string, station?: string, internalRef?: string, date?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.creditNote + `/filter?page=${page}&size=${size}&status=${status}&date=${date}&station=${station}&internalRef=${internalRef}`,)
      .pipe(catchError(this.handleError));

  getCreditNoteByStation$ = (idStation: number, internalRef: string, status?: string, date?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.creditNote + `/station/${idStation}?status=${status}&internalRef=${internalRef}&date=${date}&page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  getCreditNoteByInternalRef$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.creditNote + `/${internalRef}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
