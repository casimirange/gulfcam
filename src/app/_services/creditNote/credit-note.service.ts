import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Products} from "../../_model/products";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {RequestOpposition} from "../../_model/requestOpposition";
import {CreditNote} from "../../_model/creditNote";

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {

  constructor(private http: HttpClient) { }

  saveCreditNote(product: CreditNote): Observable<any>{
    return this.http.post<any>(environment.creditNote, product)
  }

  getCreditNote(): Observable<any>{
    return this.http.get<any>(environment.creditNote,)
  }

  getCreditNoteByInternqlRef(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.creditNote+`/${internalRef}`,)
  }

  validCreditNote(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.creditNote+`/${internalRef}`)
  }

  getCreditNoteByStation(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.creditNote+`/${internalRef}`)
  }
}
