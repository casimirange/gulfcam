import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Seance} from "../../_model/seance";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {Discipline} from "../../_model/discipline";

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {

  constructor(private http: HttpClient) { }

  disciplines$ = (userFilter?: string, type?: string, date?: string, page?: number, size?: number) => <Observable<CustomResponse<Discipline>>>
    this.http.get<CustomResponse<Discipline>>(environment.discipline + `?page=${page}&size=${size}&name=${userFilter}&type=${type}&date=${date}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message }` )
  }
}
