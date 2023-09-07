import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {CustomResponse} from "../../_interfaces/custom-response";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Session} from "../../_model/session";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  sessions$ = (page: number, size: number) => <Observable<CustomResponse<Session>>>
    this.http.get<CustomResponse<Session>>(environment.session + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  addSession$ = (session: Session) => <Observable<Session>>
    this.http.post<Session>(environment.session, session)
      .pipe(catchError(this.handleError));

  updateSession$ = (session: Session, name: string) => <Observable<Session>>
    this.http.put<Session>(environment.session+`/${name}`, session)
      .pipe(catchError(this.handleError));

  deleteSession$ = (internalRef: string) => <Observable<Session>>
    this.http.delete<Session>(environment.session+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  showSession$ = (internalRef: number) => <Observable<Session>>
    this.http.get<Session>(environment.session+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
