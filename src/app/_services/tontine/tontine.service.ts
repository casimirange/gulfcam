import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {Mangwa} from "../../_model/mangwa";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TontineService {

  constructor(private http: HttpClient) { }

  soldeTontine$ = () => <Observable<number>>
    this.http.get<number>(environment.tontine + `/solde`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
