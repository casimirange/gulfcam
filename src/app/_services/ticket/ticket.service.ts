import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  //liste des tickets par demande d'opposition
  getTicketByRequestOpposition(internalRef: number, page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.ticket + `/requestopposition/${internalRef}?page=${page}&size=${size}`)
  }

  getTicketByRequestOpposition$ = (internalRef: string,  page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.ticket + `/requestopposition/${internalRef}?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
