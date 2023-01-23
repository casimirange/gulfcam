import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {tap} from "rxjs/operators";

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

  updateStation(storeHouse: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.station+`/${internalRef}`, storeHouse)
  }

  deleteStation(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.station+`/${internalref}`)
  }

  getStationByInternalref(internalref: number): Observable<any>{
    return this.http.get<any>(environment.station+`/${internalref}`)
  }
}
