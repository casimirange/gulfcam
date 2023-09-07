import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {CustomResponse} from "../../_interfaces/custom-response";
import {catchError} from "rxjs/operators";
import {Mangwa} from "../../_model/mangwa";

@Injectable({
  providedIn: 'root'
})
export class MangwaService {

  constructor(private http: HttpClient) { }

  mangwas$ = (type?: string, date?: string, page?: number, size?: number) => <Observable<CustomResponse<Mangwa>>>
    this.http.get<CustomResponse<Mangwa>>(environment.mangwa + `?page=${page}&size=${size}&type=${type}&date=${date}`,)
      .pipe(catchError(this.handleError));

  soldeMangwa$ = () => <Observable<number>>
    this.http.get<number>(environment.mangwa + `/solde`,)
      .pipe(catchError(this.handleError));

  addMangwa$ = (mangwa: Mangwa) => <Observable<Mangwa>>
    this.http.post<Mangwa>(environment.mangwa, mangwa)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
