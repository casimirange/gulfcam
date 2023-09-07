import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Products} from "../../_model/products";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {RequestOpposition} from "../../_model/requestOpposition";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Client} from "../../_model/client";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OppositionService {

  constructor(private http: HttpClient) { }

  saveOppositionRequest(product: RequestOpposition): Observable<any>{
    return this.http.post<any>(environment.requestOpposition, product)
  }

  validOppositionRequest(internalRef: string, idSalesManager: string): Observable<any>{
    return this.http.post<any>(environment.requestOpposition+`/${internalRef}?manager=${idSalesManager}`, null)
  }

  getRequestByInternalRef(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.requestOpposition+`/${internalRef}` )
  }

  getOppositionRequest(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.requestOpposition+`?page=${page}&size=${size}`,)
  }

  filterOppositionRequest(page: number, size: number, client?: string, date?: string, statut?: string): Observable<any>{
    return this.http.get<any>(environment.requestOpposition+`/filtre?page=${page}&size=${size}&client=${client}&date=${date}&status=${statut}`,)
  }

  requests$ = (page: number, size: number, client?: string, date?: string, statut?: string, commAttach?: string, saleManager?: string) => <Observable<any>>
    this.http.get<any>(environment.requestOpposition + `/filter?page=${page}&size=${size}&client=${client}&date=${date}&status=${statut}&commercialAttach=${commAttach}&salemanager=${saleManager}`,)
      .pipe(catchError(this.handleError));

  requestByInternalRef$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.requestOpposition + `/${internalRef}`,)
      .pipe(catchError(this.handleError));

  saveRequest$ = (requestOpposition: RequestOpposition) => <Observable<RequestOpposition>>
    this.http.post<RequestOpposition>(environment.requestOpposition, requestOpposition)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
