import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Client} from "../../_model/client";
import {catchError} from "rxjs/operators";
import {Carton} from "../../_model/carton";
import {Coupon} from "../../_model/coupon";

@Injectable({
  providedIn: 'root'
})
export class CartonService {

  constructor(private http: HttpClient) { }

  createCarton(carton: any): Observable<any>{
    return this.http.post<any>(environment.carton, carton)
  }

  createCartonSupply(carton: any): Observable<any>{
    return this.http.post<any>(environment.carton+`/supply`, carton)
  }

  getCartons(): Observable<any>{
    return this.http.get<any>(environment.carton)
  }

  getAllCartonWithPagination(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.carton+ `?page=${page}&size=${size}`)
  }

  getCartonsByStoreHouse(idStoreHouse: number, page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.carton+`/storehouse/${idStoreHouse}?page=${page}&size=${size}`)
  }

  updateCarton(carton: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.carton+`/${internalRef}`, carton)
  }

  deleteCarton(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.carton+`/${internalref}`)
  }

  findCarton(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.carton+`/${internalRef}`)
  }

  cartons$ = (page: number, size: number) => <Observable<CustomResponse<Carton>>>
    this.http.get<CustomResponse<Carton>>(environment.carton + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  cartonsByStoreHouse$ = (idStoreHouse: string, page: number, size: number) => <Observable<any>>
    this.http.get<any>(environment.carton + `/storehouse/${idStoreHouse}?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  filterCarton$ = (number?: string, statut?: string, type?: string, storehouse?: string, spacemanager1?: string, date?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.carton + `/filter?page=${page}&size=${size}&number=${number}&status=${statut}&storehouse=${storehouse}&type=${type}&spacemanager1=${spacemanager1}&date=${date}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
