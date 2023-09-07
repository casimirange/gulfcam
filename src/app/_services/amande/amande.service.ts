import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CustomResponse} from "../../_interfaces/custom-response";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {Amande} from "../../_model/amande";

@Injectable({
  providedIn: 'root'
})
export class AmandeService {

  constructor(private http: HttpClient) { }

  amande$ = (userFilter?: string, type?: string, date?: string, page?: number, size?: number) => <Observable<CustomResponse<Amande>>>
    this.http.get<CustomResponse<Amande>>(environment.amande + `?page=${page}&size=${size}&name=${userFilter}&type=${type}&date=${date}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message }` )
  }
}
