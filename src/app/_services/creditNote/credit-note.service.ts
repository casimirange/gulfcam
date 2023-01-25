import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Products} from "../../_model/products";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {RequestOpposition} from "../../_model/requestOpposition";
import {CreditNote} from "../../_model/creditNote";
import {Order} from "../../_model/order";
import {catchError} from "rxjs/operators";
import {httpOptions} from "../order/order.service";

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

  getCreditNoteByInternqlRef(internalRef: number): Observable<any>{
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
}
