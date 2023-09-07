import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Coupon} from "../../_model/coupon";
import {catchError} from "rxjs/operators";
import {Carnet} from "../../_model/carnet";

@Injectable({
  providedIn: 'root'
})
export class CarnetService {

  constructor(private http: HttpClient) { }

  getCarnets(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.carnet+`?page=${page}&size=${size}`)
  }

  getCarnetsByStoreHouse(idStoreHouse: number, page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.carnet+`/storehouse/${idStoreHouse}?page=${page}&size=${size}`)
  }

  carnets$ = (page: number, size: number) => <Observable<any>>
    this.http.get<any>(environment.carnet + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  carnetsByStoreHouse$ = (idStoreHouse: string, page: number, size: number) => <Observable<any>>
    this.http.get<any>(environment.carnet + `/storehouse/${idStoreHouse}?page=${page}&size=${size}`)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
