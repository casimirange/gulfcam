import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Coupon} from "../../_model/coupon";
import {Station} from "../../_model/station";
import {Client} from "../../_model/client";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private _refresh$ = new Subject<void>();
  constructor(private http: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  createStation(storeHouse: any): Observable<any>{
    return this.http.post<any>(environment.station, storeHouse).pipe(
      tap( () =>{
        this._refresh$.next()
      } )
    )
  }

  getStations(): Observable<any>{
    return this.http.get<any>(environment.station)
  }

  getAllStationWithPagination(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.station+ `?page=${page}&size=${size}`)
  }

  updateStation(storeHouse: any, internalRef: string): Observable<any>{
    return this.http.put<any>(environment.station+`/${internalRef}`, storeHouse)
  }

  deleteStation(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.station+`/${internalref}`)
  }

  getStationByInternalref(internalref: number): Observable<any>{
    return this.http.get<any>(environment.station+`/${internalref}`)
  }

  searchStation(designation: string): Observable<any>{
    return this.http.get<any>(environment.station+ `/like/${designation}`)
  }

  filtrerStation(designation?: string, localization?: string, pinCode?: string, idManagerStation?: string, page?: number, size?: number): Observable<any>{
    return this.http.get<any>(environment.station+ `/filter?page=${page}&size=${size}&designation=${designation}&localization=${localization}&pinCode=${pinCode}&idManagerStation=${idManagerStation}`)
  }

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }

  filterStation$ = (designation?: string, localization?: string, pinCode?: string, idManagerStation?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.station + `/filter?page=${page}&size=${size}&designation=${designation}&localization=${localization}&pinCode=${pinCode}&idManagerStation=${idManagerStation}`,)
      .pipe(catchError(this.handleError));

  getStationByInternalref$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.station+ `/${internalRef}`)
      .pipe(catchError(this.handleError));

  addStation$ = (station: Station) => <Observable<Station>>
    this.http.post<Station>(environment.station, station)
      .pipe(catchError(this.handleError));

  updateStation$ = (station: Station, internalRef: number) => <Observable<Station>>
    this.http.post<Station>(environment.station+`/${internalRef}`, station)
      .pipe(catchError(this.handleError));
}
