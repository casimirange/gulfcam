import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MvtStockService {

  constructor(private http: HttpClient) { }

  createStockMovement(stock: any): Observable<any>{
    return this.http.post<any>(environment.stock, stock)
  }

  stockMovement$ = (page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.stock + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }

}
