import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CartonService {

  constructor(private http: HttpClient) { }

  createCarton(carton: any): Observable<any>{
    return this.http.post<any>(environment.carton, carton)
  }

  createCartonSupply(carton: any): Observable<any>{
    return this.http.post<any>(environment.carton+'/supply', carton)
  }

  getCartons(): Observable<any>{
    return this.http.get<any>(environment.carton)
  }

  getCartonsByStoreHouse(idStoreHouse: number, page: number,): Observable<any>{
    return this.http.get<any>(environment.carton+`/storehouse/${idStoreHouse}?page=${page}`)
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
}
