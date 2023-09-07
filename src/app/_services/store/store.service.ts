import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {TypeVoucher} from "../../_model/typeVoucher";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {Store} from "../../_model/store";
import {catchError} from "rxjs/operators";
import {Client} from "../../_model/client";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }

  createStore(store: Store): Observable<any>{
    return this.http.post<any>(environment.store, store)
  }

  getStore(): Observable<any>{
    return this.http.get<any>(environment.store)
  }

  getAllStoresWithPagination(page?: number, size?: number): Observable<any>{
    return this.http.get<any>(environment.store+ `?page=${page}&size=${size}`)
  }

  getStoreByInternalref(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.store + `/${internalRef}`)
  }

  //liste des entrepots par magasin
  getStoreHouseByStore(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.store + `/${internalRef}`)
  }

  deleteStore(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.store+`/${internalref}`)
  }

  updateStore(store: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.store+`/${internalRef}`, store);
  }

  //liste des unités par magasin
  getUnitByStore(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.store + `/group/${internalRef}`)
  }


  store$ = (page?: number, size?: number, idStore?: string) => <Observable<any>>
    this.http.get<any>(environment.store + `?page=${page}&size=${size}&store=${idStore}`,)
      .pipe(catchError(this.handleError));

  addStore$ = (store: Store) => <Observable<any>>
    this.http.post<any>(environment.store, store)
      .pipe(catchError(this.handleError));

  updateStore$ = (store: Store, internalRef: number) => <Observable<any>>
    this.http.put<any>(environment.store+`/${internalRef}`, store)
      .pipe(catchError(this.handleError));

  storeByInternalRef$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.store+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  unitByStore$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.store+`/group/${internalRef}`)
      .pipe(catchError(this.handleError));


  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }


}
