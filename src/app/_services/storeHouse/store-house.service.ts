import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {Store} from "../../_model/store";
import {StoreHouse} from "../../_model/storehouse";

@Injectable({
  providedIn: 'root'
})
export class StoreHouseService {

  constructor(private http: HttpClient) { }

  createStoreHouse(storeHouse: any): Observable<any>{
    return this.http.post<any>(environment.storeHouse, storeHouse)
  }

  getStoreHouses(): Observable<any>{
    return this.http.get<any>(environment.storeHouse)
  }

  getAllStoreHousesWithPagination(page: number, size: number, idStore?: string, type?: string): Observable<any>{
    return this.http.get<any>(environment.storeHouse+ `?page=${page}&size=${size}&store=${idStore}&type=${type}`)
  }

  getStoreHouseByInternalRef(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.storeHouse + `/${internalRef}`)
  }

  getStoreHousesByStore(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.storeHouse + `/store/${internalRef}`)
  }

  updateStoreHouse(storeHouse: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.storeHouse+`/${internalRef}`, storeHouse)
  }

  deleteStoreHouse(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.storeHouse+`/${internalref}`)
  }

  //liste des unités par magasin
  getItemByStoreHouse(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.storeHouse + `/group/${internalRef}`)
  }


  storeHouse$ = (page?: number, size?: number, idStore?: string, type?: string) => <Observable<any>>
    this.http.get<any>(environment.storeHouse + `?page=${page}&size=${size}&store=${idStore}&type=${type}`,)
      .pipe(catchError(this.handleError));

  addStoreHouse$ = (store: StoreHouse) => <Observable<any>>
    this.http.post<any>(environment.storeHouse, store)
      .pipe(catchError(this.handleError));

  updateStoreHouse$ = (store: any, internalRef: number) => <Observable<any>>
    this.http.put<any>(environment.storeHouse+`/${internalRef}`, store)
      .pipe(catchError(this.handleError));

  storeHouseByInternalRef$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.storeHouse+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  storeHouseByStore$ = (internalRef: string, page?: number) => <Observable<any>>
    this.http.get<any>(environment.storeHouse+`/store/${internalRef}?page=${page}`)
      .pipe(catchError(this.handleError));

  itemByStoreHouse$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.storeHouse+`/group/${internalRef}`)
      .pipe(catchError(this.handleError));


  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }

}
